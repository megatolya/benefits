'use strict';

const EXPORTED_SYMBOLS = ['uiManager'];

const {
    classes: Cc,
    interfaces: Ci,
    utils: Cu,
    results: Cr
} = Components;

Cu.import('resource:///modules/CustomizableUI.jsm');

let uiManager = {
    init: function (aCore) {
        this._core = aCore;

        this._createWidget();
    },

    finalize: function () {
        this._destroyWidget();

        this._core = null;
    },

    get _widgetButtonId() {
        return this._core.appName + '-widget-button';
    },

    _createWidget: function () {
        CustomizableUI.createWidget({
            id: this._widgetButtonId,
            type: 'button',
            defaultArea: CustomizableUI.AREA_NAVBAR,
            label: 'Achievements',
            tooltiptext: 'Achieve me, bitch'
        });
    },

    _destroyWidget: function () {
        CustomizableUI.destroyWidget(this._widgetButtonId);
    }
};
