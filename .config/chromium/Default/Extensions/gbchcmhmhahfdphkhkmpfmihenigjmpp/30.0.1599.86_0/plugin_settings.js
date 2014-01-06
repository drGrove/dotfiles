// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Contains all the settings that may need massaging by the build script.
// Keeping all that centralized here allows us to use symlinks for the other
// files making for a faster compile/run cycle when only modifying HTML/JS.

'use strict';

/** @suppress {duplicate} */
var remoting = remoting || {};

/** @type {remoting.Settings} */
remoting.settings = null;
/** @constructor */
remoting.Settings = function() {};

// The settings on this file are automatically substituted by build-webapp.py.
// Do not override them manually, except for running local tests.

/** @type {string} MIME type for the host plugin.*/
remoting.Settings.prototype.PLUGIN_MIMETYPE = 'application/vnd.chromium.remoting-host';
/** @type {string} API client ID.*/
remoting.Settings.prototype.OAUTH2_CLIENT_ID = '440925447803-avn2sj1kc099s0r7v62je5s339mu0am1.apps.googleusercontent.com';
/** @type {string} API client secret.*/
remoting.Settings.prototype.OAUTH2_CLIENT_SECRET = 'Bgur6DFiOMM1h8x-AQpuTQlK';

/** @type {string} Base URL for OAuth2 authentication. */
remoting.Settings.prototype.OAUTH2_BASE_URL = 'https://accounts.google.com/o/oauth2';
/** @type {string} Base URL for the OAuth2 API. */
remoting.Settings.prototype.OAUTH2_API_BASE_URL = 'https://www.googleapis.com/oauth2';
/** @type {string} Base URL for the Remoting Directory REST API. */
remoting.Settings.prototype.DIRECTORY_API_BASE_URL = 'https://www.googleapis.com/chromoting/v1';
/** @type {string} URL for the talk gadget web service. */
remoting.Settings.prototype.TALK_GADGET_URL = 'https://chromoting-client.talkgadget.google.com/talkgadget/';
/** @type {string} OAuth2 redirect URI. */
remoting.Settings.prototype.OAUTH2_REDIRECT_URL = 'https://chromoting-oauth.talkgadget.google.com/talkgadget/oauth/chrome-remote-desktop/rel/' + chrome.i18n.getMessage('@@extension_id');

/** @type {string} XMPP JID for the remoting directory server bot. */
remoting.Settings.prototype.DIRECTORY_BOT_JID = 'remoting@bot.talk.google.com';

// XMPP server connection settings.
/** @type {string} XMPP server host name (or IP address) and port. */
remoting.Settings.prototype.XMPP_SERVER_ADDRESS = 'talk.google.com:5222';
/** @type {boolean} Whether to use TLS on connections to the XMPP server. */
remoting.Settings.prototype.XMPP_SERVER_USE_TLS =
    true;

// Third party authentication settings.
/** @type {string} The third party auth redirect URI. */
remoting.Settings.prototype.THIRD_PARTY_AUTH_REDIRECT_URI =
    'https://chromoting-oauth.talkgadget.google.com/talkgadget/oauth/chrome-remote-desktop/thirdpartyauth';
