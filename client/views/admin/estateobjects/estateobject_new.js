var uploadedImagesArr = new ReactiveVar([]);
var coords = null;

Deps.autorun(function() {
    return uploadedImagesArr;
});

Template.estateobjectNew.helpers({

    'repairtypes': function () {

        return Repairtypes.find();
    },

    'typeofestates': function () {

        return Typeofestates.find();
    },

    'cityblocks': function () {

        var loggedInUser = Meteor.user();

        return CityBlocks.find();
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

Template.estateobjectNew.rendered = function() {
    $.getScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU', function (data, textStatus, jqxhr) {

        ymaps.ready(init);

        var loggedInUser = Meteor.user();

        var city_id = loggedInUser.city_id;

        var city = Cities.findOne(city_id);

        function init () {

            $('#map-wrapper').css({
                'height': '300px'
            });
            // Создание экземпляра карты и его привязка к контейнеру с
            // заданным id ("map").
            myMap = new ymaps.Map('map-wrapper', {
                // При инициализации карты обязательно нужно указать
                // её центр и коэффициент масштабирования.
                center: [city.coordX,city.coordY], // Ярославль. Добавить к cities координаты.
                zoom: 16,
                // Тип покрытия карты: "Карта".
                type: 'yandex#map'
            });

            var myPlacemark = new ymaps.Placemark([city.coordX,city.coordY], {}, {
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

                    var myGeoCoder = ymaps.geocode('Россия ' + city.cityName + ' ' + street + ' ' + houseNumber);

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

                    var myGeoCoder = ymaps.geocode('Россия ' + city.cityName + ' ' + street + ' ' + houseNumber);

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

    var uploadedImages = this.uploadedImages || [];
    uploadedImagesArr.set(uploadedImages);

    $('#dateOfOpening').datepicker();
    $('#dateOfOpening').datepicker("option","dateFormat","dd.mm.yy");
    $('#dateOfOpening').datepicker("option","dayNamesMin",["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]);
    $('#dateOfOpening').datepicker("option","monthNames",["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]);
    $('#dateOfOpening').datepicker("option","monthNamesShort",["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"]);
    $('#dateOfOpening').datepicker("option","firstDay",1);
};

Template.estateobjectNew.events({

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


        Meteor.call('checkPhone', entity.phone, function (error, obj) {

            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при сохранении.');
                return;
            } else {

                
                if (obj && obj.obj) {

                    if (obj.type === 'blacklist') {

                        showNotice('error', 'Номер ' + obj.obj.phone + ' находится в черном списке.');
                        return;
                    } else if (obj.type === 'object') {

                        showNotice('error', 'ОБЪЕКТ с таким номером телефона уже существует: ' + obj.obj.owner + ' ул.' + obj.obj.street + ', д.' + obj.obj.houseNumber + '.');
                        return;
                    } else if (obj.type === 'client') {

                        showNotice('error', 'Клиент с номером ' + obj.obj.phone + ' уже существует.');
                        return;
                    }
                } else {

                    Meteor.call('estateobjectInsert', entity, function (error, result) {

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

                                Router.go('estateobject', {_id: result._id});
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
});