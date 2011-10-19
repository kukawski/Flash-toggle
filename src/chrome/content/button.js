var FlashToggle = (function () {
    Components.utils.import("resource://gre/modules/AddonManager.jsm");
    
    const FLASH_PLUGIN = "Shockwave Flash";
    const ID = "flashtoggle";
    const DISABLED_CLASS = "off";
    const AM = AddonManager;
    var i18n;
    
    function addonStateChanged (addon, isUninstalled) {
        if (addon && addon.type === "plugin" && addon.name === FLASH_PLUGIN) {
            var disabled = addon.appDisabled || addon.userDisabled;
            var button = document.getElementById(ID);
            
            button.disabled = !!isUninstalled;
            
            if (disabled) {
                button.classList.add(DISABLED_CLASS);
            } else {
                button.classList.remove(DISABLED_CLASS);
            }
            
            if (i18n) {
                button.setAttribute("tooltiptext", i18n.getString(isUninstalled ? "button.flash_doesnt_exist" : (disabled ? "button.enable_flash" : "button.disable_flash")));
            }
        }
    }
    
    function findFlashPlugin (success, failure) {
        AM.getAddonsByTypes(["plugin"], function (plugins) {
            for (var i = 0, l = plugins.length; i < l; i++) {
                var plugin = plugins[i];
                
                if (plugin.name === FLASH_PLUGIN) {
                    success && success(plugin);
                    return;
                }
            }
            
            failure && failure();
        });
    }
    
    function flashNotFound () {
        var button = document.getElementById(ID);
        
        button.disabled = true;
        button.setAttribute("tooltiptext", i18n.getString("button.flash_doesnt_exist"));
    }
    
    AM.addAddonListener({
        onEnabled: addonStateChanged,
        onDisabled: addonStateChanged,
        onInstalled: addonStateChanged,
        onUninstalled: function (addon) {
            //addonStateChanged(addon, true);
            findFlashPlugin(addonStateChanged, flashNotFound);
        }
    });
    
    window.addEventListener("load", function () {
        i18n = document.getElementById("strings");
        findFlashPlugin(addonStateChanged, flashNotFound);
    }, false);
    
    return {
        click: function () {
            findFlashPlugin(function (plugin) {
                plugin.userDisabled = !plugin.userDisabled;
            });
        }
    };
}());