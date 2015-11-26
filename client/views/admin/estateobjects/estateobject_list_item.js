Template.estateobjectListItem.helpers({

    'cityBlockName': function () {

        var cityblockItem = CityBlocks.findOne(this.cityblock_id);

        return cityblockItem.cityBlockName;
    },

    'typeOfEstateName': function () {

        var typeOfEstateItem = Typeofestates.findOne(this.typeofestate_id);

        return typeOfEstateItem.typeOfEstateName;
    },

    'repairTypeName': function () {

        var repairTypeItem = Repairtypes.findOne(this.repairtype_id);

        return repairTypeItem.repairTypeName;
    },

    'isFurniture': function () {

    	if (this.furniture == '1') {

    		return 'да';
    	} else {

    		return 'нет';
    	}
    },

    'isTechnics': function () {

    	if (this.technics == '1') {

    		return 'да';
    	} else {

    		return 'нет';
    	}
    },

    'isWillBeFree': function () {

    	if (this.isOpening) {

    		return 'Должна освободиться: ' + this.dateOfOpening;
    	} else {

    		return '';
    	}
    },

    'isOurParner': function () {

        if (this.isPartner) {

            return 'да';
        } else {

            return 'нет';
        }
    },

    'yaCallStatus': function () {

    	if (this.callStatus == 200) {

    		return 'OK';
    	} else if (this.callStatus == 500) {

    		return 'Н.Д.';
    	} else {

    		return 'Н.О.';
    	}
    },

    'isInBlackList': function () {

        if (BlackList.findOne({'phone': this.phone})) {

            return 'blacklist-item';
        }

        return 'normal-item';
    }
});