var uploadedImagesArr = new ReactiveVar([]);
var coords = null;

Deps.autorun(function() {
    return uploadedImagesArr;
});

Template.estateobject.helpers({

    'typeofestates': function () {

        var typeofestates,
            that;


        that = this;


        typeofestates = Typeofestates.find().fetch();
        
        _.each(typeofestates, function (value) {

            if (value._id == that.typeofestate_id) {

                _.extend(value, {
                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });
        
        return typeofestates;
    },

     'repairtypes': function () {

        var repairtypes,
            that;


        that = this;


        repairtypes = Repairtypes.find().fetch();

        _.each(repairtypes, function (value) {

            if (value._id == that.repairtype_id) {

                _.extend(value, {
                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });
        
        return repairtypes;
    },

    'cityblocks': function () {

        var loggedInUser,
            cityblocks,
            that;


        that = this;


        loggedInUser = Meteor.user();


        cityblocks = CityBlocks.find().fetch();   
        
        _.each(cityblocks, function (value) {

            if (value._id == that.cityblock_id) {

                _.extend(value, {
                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });

        return cityblocks;
    },

    'isOpening': function () {
        
        if (this.isOpening) {

            return 'checked';
        }
    },

     'isPartner': function () {
        
        if (this.isPartner) {

            return 'checked';
        }
    },

    'ifFurniture': function () {
        
        if (this.furniture == '0') {
            
            return 'selected';
        }
    },


    'ifTechnics': function () {
        
        if (this.technics == '0') {
            
            return 'selected';
        }
    },

    'ifActive': function () {
        
        if (this.estateobjectStatus === 'active') {
            
            return 'selected';
        }
    },

    'ifAdv': function () {
        
        if (this.estateobjectStatus === 'adv') {

            return 'selected';
        }
    },

    'ifArchive': function () {
        
        if (this.estateobjectStatus === 'archive') {

            return 'selected';
        }
    },

    'ifCall': function () {
        
        if (this.estateobjectStatus === 'call') {

            return 'selected';
        }
    },

    'ifOK': function () {
        
        if (this.callStatus == 200) {
            
            return 'selected';
        }
    },

    'ifND': function () {
        
        if (this.callStatus == 500) {

            return 'selected';
        }
    },

    'ifNO': function () {
        
        if (this.callStatus == 404) {

            return 'selected';
        }
    },

    'backUrl': function () {

        var url;

        if (Session.get('clientsUrl')) {

            url = YaFilter.clean({
                'source': s(Session.get('clientsUrl')).trim().value(),
                'type': 'stringurl'
            });

            return url;
        } else {

            return '/estateobjects'
        }
    },

    'uploadedImagesArr': function () {

        return uploadedImagesArr.get();
    },

    'myCallbacks': function() {

        return {
        
            'finished': function(index, fileInfo, context) {

                var currImages = uploadedImagesArr.get();
                currImages.push({'name': fileInfo.name, 'subDirectory': fileInfo.subDirectory});
                uploadedImagesArr.set(currImages);
            }
        }
    },
    'specificFormData': function () {

        var id = this._id || Meteor.uuid();

        return {
          'id': id
        }
    }
});

Template.estateobject.rendered = function() {

    coords = this.data.coords;

    var currCity = Cities.findOne(this.data.city_id);

    if (!_.isArray(coords) || coords.length === 0) {
        coords = [currCity.coordX,currCity.coordY];
    }

    var cityName = this.data.cityName;

    $.getScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU', function (data, textStatus, jqxhr) {

        ymaps.ready(init);

        function init () {

            $('#map-wrapper').css({
                'height': '300px'
            });

            // Создание экземпляра карты и его привязка к контейнеру с
            // заданным id ("map").
            myMap = new ymaps.Map('map-wrapper', {
                // При инициализации карты обязательно нужно указать
                // её центр и коэффициент масштабирования.
                center: coords, 
                zoom: 16,
                // Тип покрытия карты: "Карта".
                type: 'yandex#map'
            });

            var myPlacemark = new ymaps.Placemark(coords, {}, {
                'draggable': true
            });

            myPlacemark.events.add('dragend', function (e) {

                var resCoords = e.get('target').geometry.getCoordinates();

                myMap.panTo(resCoords);
                coords = resCoords;
            });

            myMap.geoObjects.add(myPlacemark);

            $('#street').blur(function (event) {


                var houseNumber = s($('#houseNumber').val()).trim().value();

                event.preventDefault();

                var street = s($(this).val()).trim().value();


                if (street) {

                    var myGeoCoder = ymaps.geocode('Россия ' + currCity.cityName + ' ' + street + ' ' + houseNumber);

                    myGeoCoder.then(
                        function (res) {

                            var resCoords = res.geoObjects.get(0).geometry.getCoordinates();
                            
                            myPlacemark.geometry.setCoordinates(resCoords);

                            myMap.panTo(resCoords);
                            coords = resCoords;
                        },
                        function (err) {
                            
                            showNotice('error', 'Ошибка при определении координат метки.');
                        }
                    );
                }
            });

            $('#houseNumber').blur(function (event) {


                var houseNumber = s($(this).val()).trim().value();

                event.preventDefault();

                var street = s($('#street').val()).trim().value();


                if (street) {

                    var myGeoCoder = ymaps.geocode('Россия ' + currCity.cityName + ' ' + street + ' ' + houseNumber);

                    myGeoCoder.then(
                        function (res) {

                            var resCoords = res.geoObjects.get(0).geometry.getCoordinates();
                            
                            myPlacemark.geometry.setCoordinates(resCoords);

                            myMap.panTo(resCoords);
                            coords = resCoords;
                        },
                        function (err) {

                            showNotice('error', 'Ошибка при определении координат метки.');
                        }
                    );
                }
            });
        }               
    });

    var uploadedImages = this.data.uploadedImages || [];
    uploadedImagesArr.set(uploadedImages);

    $('#dateOfOpening').datepicker();
    $('#dateOfOpening').datepicker("option","dateFormat","dd.mm.yy");
    $('#dateOfOpening').datepicker("option","dayNamesMin",["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]);
    $('#dateOfOpening').datepicker("option","monthNames",["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]);
    $('#dateOfOpening').datepicker("option","monthNamesShort",["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"]);
    $('#dateOfOpening').datepicker("option","firstDay",1);


    if (this.data.dateOfOpening) {
        
        if (new Date(this.data.dateOfOpening) < new Date()) {

            $('#dateOfOpening').val('');
            $('#isOpening').prop('checked', false);
        } else {

            $('#isOpening').prop('checked', true);
            $('#dateOfOpening').datepicker('setDate', this.data.dateOfOpening);
        }
    }
    
};

Template.estateobject.events({

    'click #isOpening': function () {

        if ($('#isOpening:checked').length) {

            if (!$('#dateOfOpening').val()) {

                $('#dateOfOpening').datepicker('setDate', new Date());
            }
            
            $('#dateOfOpening').datepicker('show');
        } else {

            $('#dateOfOpening').val('');
            $('#dateOfOpening').datepicker('hide');
        }
    },

    'click .save-btn': function (e) {

        var entity,
            entityId,
            haveErrors = false,
            errors = [];


        $('.invalid').removeClass('invalid');

        e.preventDefault();

        entity = {

            'owner': $.trim(YaRequest.getString('owner', '', 'INPUT')), // required

            'phone': $.trim(YaRequest.getNumber('phone', '', 'INPUT')), // required 

            'cityblock_id': YaRequest.getAlnum('cityblock_id', '', 'INPUT'), // required

            'typeofestate_id': YaRequest.getAlnum('typeofestate_id', '', 'INPUT'),// required

            'price': $.trim(YaRequest.getInt('price', '', 'INPUT')),

            'street': $.trim(YaRequest.getString('street', '', 'INPUT')),

            'houseNumber': $.trim(YaRequest.getString('houseNumber', '', 'INPUT')),

            'repairtype_id': YaRequest.getAlnum('repairtype_id', '', 'INPUT'),// required

            'floor': $.trim(YaRequest.getInt('floor', '', 'INPUT')),

            'floority': $.trim(YaRequest.getInt('floority', '', 'INPUT')),

            'furniture': $.trim(YaRequest.getInt('furniture', '', 'INPUT')),

            'technics': $.trim(YaRequest.getInt('technics', '', 'INPUT')),

            'areaFull': $.trim(YaRequest.getInt('areaFull', '', 'INPUT')),

            'areaLiving': $.trim(YaRequest.getInt('areaLiving', '', 'INPUT')),

            'areaKitchen': $.trim(YaRequest.getInt('areaKitchen', '', 'INPUT')),
            
            'desc': $.trim(YaRequest.getString('desc', '', 'INPUT')),

            'uploadedImages': uploadedImagesArr.get(),

            'estateobjectStatus': YaRequest.getWord('estateobjectStatus', false, 'INPUT'), // required

            'source': $.trim(YaRequest.getString('source', '', 'INPUT')), // required

            'isOpening': YaRequest.getBool('isOpening', false, 'SELECT'),

            'dateOfOpening': $('#dateOfOpening').datepicker('getDate'),

            'isPartner': YaRequest.getBool('isPartner', false, 'SELECT'),

            'callStatus': $.trim(YaRequest.getInt('callStatus', '', 'INPUT')),

            'notes': $.trim(YaRequest.getString('notes', '', 'INPUT')),

            'coords': coords
        };               


        if (entity.dateOfOpening) {

            entity.dateOfOpening.toString();
        }

        if (!entity.owner) {

            errors.push('owner');
            haveErrors = true;
        }

        if (!entity.cityblock_id) {

            errors.push('cityblock_id');
            haveErrors = true;
        }

        if (!entity.typeofestate_id) {

            errors.push('typeofestate_id');
            haveErrors = true;
        }


        if (!entity.price || entity.price == '0') {

            errors.push('price');
            haveErrors = true;
        }

        if (!entity.street) {

            errors.push('street');
            haveErrors = true;
        }

        if (!entity.source) {

            errors.push('source');
            haveErrors = true;
        }

        if (!entity.repairtype_id) {

            errors.push('repairtype_id');
            haveErrors = true;
        }


        if (!entity.phone) {

            errors.push('phone');
            haveErrors = true;
        }

        var phone = entity.phone.toString();


        var setCharAt = function (str,index,chr) {

            if(index > str.length-1) {

                return str;
            }

            return str.substr(0,index) + chr + str.substr(index+1);
        };


        if (phone.charAt(0) === '8') {

            phone = setCharAt(phone, 0, '7');
        }

        if (phone.charAt(0) === '9' || phone.charAt(0) === '4') {

            phone = '7' + phone;
        }

        if (phone.charAt(0) != '7') {

            errors.push('phone');
            haveErrors = true;
        }

        if (phone.charAt(1) != '9' && phone.charAt(1) != '4') {

            errors.push('phone');
            haveErrors = true;
        }

        if (phone.length != 11) {

            errors.push('phone');
            haveErrors = true;
        }

        entity.phone = parseInt(phone, 10);


        if (!entity.callStatus) {

            errors.push('callStatus');
            haveErrors = true;
        }

        if (!entity.estateobjectStatus) {

            errors.push('estateobjectStatus');
            haveErrors = true;
        }

        if (!entity.isOpening) {

            entity.dateOfOpening = '';
        }

        if (entity.isOpening) {

            if (!entity.dateOfOpening) {

                errors.push('dateOfOpening');
                haveErrors = true;
            }
        }


        if (haveErrors) {

            _.each(errors, function (element) {

                $('#' + element).addClass('invalid');
            });

            showNotice('error', 'Некорректно заполнены поля.'); // ToDo - Add multulanguage support (Yackovlev)

            return;
        }


        var btnName = $(e.target).attr('data-id');

        entityId = this._id;



        Meteor.call('checkPhone', this.phone, function (error, obj) {

            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при сохранении.');
                return;
            } else {

                
                if (obj && obj.obj) {

                    if (obj.type === 'blacklist') {

                        showNotice('error', 'Номер ' + obj.obj.phone + ' находится в черном списке.');
                        return;
                    } else {

                        Meteor.call('estateobjectUpdate', entityId, entity, function (error, result) {

                            if (error) {

                                // display the error to the user
                                showNotice('error', 'Ошибка при сохранении.');
                                return;
                            } else {

                                if (result && result.status == 'error') {
                                    
                                    showNotice('error', 'Ошибка при сохранении.');
                                    return;
                                }

                                showNotice('note', 'Запись сохранена');

                                if (btnName === 'saveBtn') {

                                    Router.go('estateobject', {_id: entityId});
                                } else if (btnName === 'saveAndCloseBtn') {

                                    if (history && history.length > 1) {

                                        history.back();
                                    } else {

                                        Router.go('estateobjects');
                                    }
                                } else if (btnName === 'saveAndCreateBtn') {

                                    Router.go('estateobjectNew');
                                }
                            }
                        });
                    }
                } else {

                    Meteor.call('estateobjectUpdate', entityId, entity, function (error, result) {

                        if (error) {

                            // display the error to the user
                            showNotice('error', 'Ошибка при сохранении.');
                            return;
                        } else {

                            if (result && result.status == 'error') {
                                
                                showNotice('error', 'Ошибка при сохранении.');
                                return;
                            }

                            showNotice('note', 'Запись сохранена');

                            if (btnName === 'saveBtn') {

                                Router.go('estateobject', {_id: entityId});
                            } else if (btnName === 'saveAndCloseBtn') {

                                if (history && history.length > 1) {

                                    history.back();
                                } else {

                                    Router.go('estateobjects');
                                }
                            } else if (btnName === 'saveAndCreateBtn') {

                                Router.go('estateobjectNew');
                            }
                        }
                    });
                }
            }
        });
    },

    'click .backBtn': function (e) {

        e.preventDefault();

        if (history && history.length > 1) {

            history.back();
        } else {

            Router.go('estateobjects');
        }
    },

    'click #removeBtn': function (e) {

        var id;

        e.preventDefault();

        //id = $(e.target).data('id');

        id = YaFilter.clean({
            'source': s(this._id).trim().value(),
            'type': 'AlNum'
        });
        
        Meteor.call('estateobjectRemove', id, function (error) {

            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при удалении.');
                return;
            } else {

                showNotice('note', 'Запись удалена');

                if (history && history.length > 1) {

                    history.back();
                } else {

                    Router.go('estateobjects');
                }
            }
        });
    }
});