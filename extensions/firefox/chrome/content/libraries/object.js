'use strict';

let Library = {};

Library.Object = {
    isObject: function (aObj) {
        return (aObj && typeof aObj === 'object' && !Array.isArray(aObj));
    },

    copyObjectProperties: function (aSource, aTarget = {}, replaceIfExists = true) {
        if (!this.isObject(aSource)) {
            throw new Error('Source should be an object.');
        }

        Object.keys(aSource).forEach((aKey) => {
            if (aKey === 'constructor') {
                return;
            }

            let propertyDescriptor = Object.getOwnPropertyDescriptor(aSource, aKey);

            // Свойство из aSource не будет скопировано, если такое свойство есть в самом объекте
            // или в прототипе, когда replaceIfExists === false;
            if (typeof aTarget[aKey] === 'undefined' || replaceIfExists) {
                Object.defineProperty(aTarget, aKey, propertyDescriptor);
            }
        });

        return aTarget;
    }
};
