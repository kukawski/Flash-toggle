var FlashToggle = (function () {
    Components.utils.import("resource://gre/modules/AddonManager.jsm");
    
    const FLASH_PLUGIN = "Shockwave Flash";
    const DISABLED_CLASS = 'off';
    const AM = AddonManager;
    var i18n;
    
    function addonStateChanged (addon) {
        if (addon && addon.type === "plugin" && addon.name === FLASH_PLUGIN) {
            var disabled = addon.appDisabled || addon.userDisabled;
            
            var button = document.getElementById('flashtoggle');
            
            if (disabled) {
                button.classList.add(DISABLED_CLASS);
            } else {
                button.classList.remove(DISABLED_CLASS);
            }
            
            if (i18n) {
                button.setAttribute('tooltiptext', i18n.getString(disabled ? 'button.enable_flash' : 'button.disable_flash'));
            }
        }
    }
    
    function findFlashPlugin (callback) {
        AM.getAddonsByTypes(["plugin"], function (plugins) {
            for (var i = 0, l = plugins.length; i < l; i++) {
                var plugin = plugins[i];
                
                if (plugin.name === FLASH_PLUGIN) {
                    return callback(plugin);
                }
            }
        });
    }
    
    AM.addAddonListener({
        onEnabled: addonStateChanged,
        onDisabled: addonStateChanged
    });
    
    window.addEventListener("load", function () {
        i18n = document.getElementById("strings");
        //findFlashPlugin(addonStateChanged);
    }, false);
    
    return {
        click: function () {
            findFlashPlugin(function (plugin) {
                plugin.userDisabled = !plugin.userDisabled;
            });
        }
    };
}());