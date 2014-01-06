
function PopupInstaller(callback) {
    var jsonStats = null;
    var installProgressBar = null;
    callback = $.isFunction(callback) ? callback : function() { };
    
    this.install = function() {

        background.log('not installed');
        //background.console.log(background.localStorage.getItem('db_installation_status_' + background.getDatabaseLocale()));
        $('#slider').hide();
        $('#install').show();

        //$('#installdiv .stats').text('0 / ' + jsonStats.methods).show();

        installProgressBar = $('.progressBar');
        installProgressBar.simpleProgressBar({
            counterElm: $('#installdiv h2 > span'), 
            max: jsonStats.methods
        });

        $('#installdiv p.note span').text(background.languages[background.getDatabaseLocale()].toLowerCase());


        //return;
        //background.log(background.installer.timeElapsed());
        // installation started but user closed the popup window
        if (background.ls.getItem('db_installation_status_' + background.getDatabaseLocale()) === 'pending' && background.installer.timeElapsed() < 300000) {
            //$('#installdiv').find('.progressBar, h2, .stats').hide();
            //$('#installdiv .note').text('Installing at background, please wait...').show();
            background.installer.continueInstallation(this.progress, this.progress);
        } else { // start installation
            //$('#install > h2').text('Removing old database');
            background.installer.install(this.progress, this.progress);
        }
            
    };
        
    this.progress  = function(processed) {
        installProgressBar.progress(processed);
        $('#installdiv .stats').text((jsonStats.methods - processed) + " " + 'left');

        if (processed === jsonStats.methods) {
            background.log('done');

            $('#install p.note').text('Preparing indexes... (this might take a few seconds)');
            $('#install').hide();

//            background.model.isReadable(function() {
                //localStorage.setItem('current_version', background.chrome.manifest.version);
            window.installer.installed();
//            });
        }
    };
        
    this.installed = function() {
        background.log('installed');
        $('#searchdiv, #slider').show();
        $('#install').hide();

        //var loadFromStorage = false;
        // if (background.ls.getItem('last_search')) {
        //     $('#contentdiv').show();
        // }

        if (background.ls.getItem('last_search')) {
            // $('#search').val(localStorage.getItem('last_search')).click();
            $('#doc').show();
            App.setSearch(background.ls.getItem('last_search'), true);
            $('#search').focus().select();
            // App.find();
        } else {
            $('#hellodiv').show();
            $('#search').focus();
        }

    };
        
    this.upgrade = function() {
        //var now = new Date().getTime();
        
        // $('#install-jokes').hide();
        // $('#upgrade-info').show();
        // 
        if (background.ls.getItem('last_search')) {
            $('#search').val(localStorage.getItem('last_search'));//.select();
        } else {
            $('#hellodiv').show();
        }
        
        // callback();
        //$('#search').trigger('focus');
        //$('#search').focus();

        // check when was this extension installed
        if (!background.ls.getItem('date_installed')) {
            background.ls.setItem('date_installed', new Date().getTime() / 1000);
            background.ls.setItem('terms_searched', 0);
        }/* else if (localStorage.getItem('feedbackclosed1') != 1) {
            // 7 days
            var nowDays = new Date().getTime() / 1000 / 3600 / 24;
            var installDate = background.ls.getItem('date_installed') / 3600 / 24;
            var termsSearched = background.ls.getItem('terms_searched');
            if (nowDays > 7 && termsSearched > 100) {
                $('#iwantyou').show();
            }
        }*/

        //if (localStorage.getItem('last_object_method')) {
            //alert(localStorage.getItem('last_object_method'));
            //$('#search').val(localStorage.getItem('last_object_method')).select();
        //}
     
        background.log('upgrade');
        $('#install > h2').text('Updating database');
        this.install();
    };
        
    this.checkInstallation = function() {
        jsonStats = background.loadJsonStats();
        //callback = $.isFunction(callback) ? callback : function() {};

        //App.showContainer('loading');

        if (jsonStats.timestamp == background.getDatabaseTimestamp()) {
            window.installer.installed();
        } else {
            /*if (!background.model) {
                background.openModel();
            }*/
            
            background.openModel();
            background.model.count(
                function(count) {
                    if (0 == count) {
                        window.installer.install();
                    } else {
                        window.installer.upgrade();
                    }
                    //callback();
                }, function() { // on query error
                    if (background.getDatabaseTimestamp()) {
                        window.installer.upgrade(); // database structure is invalid, reinstall
                    } else {
                        window.installer.install(); // database probably has never been installed, install
                    }
                    //callback();
                }
            ); // end transaction
        }
    }; // end method

}
