/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2011 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.

AdobePatentID="2121US01"
AdobePatentID="2122US01"

**************************************************************************/
var SkyLabController = require('../../skylab.js').SkyLabController;

    describe("Survey Link", function () {
        it('returns survey link', function () {
            var surveyLink = SkyLabController.getSurveyLink();
            expect(surveyLink).toEqual("http://adobe.com/go/edgeinspect_nps_survey");
        });
    });
/*
describe("FollowMode Toggles", function () {
    it('Gets The Current Follow Mode', function () {
        var followMode = SkyLabController.getFollowMode();
        expect(followMode).toNotEqual("");
    });
    
    it('Sets The FollowMode to On', function () {
        SkyLabController.setFollowMode("on");
        var followMode = SkyLabController.getFollowMode();
        expect(followMode).toEqual("on");
    });
    
    it('Sets The FollowMode to Off', function () {
        SkyLabController.setFollowMode("off");
        var followMode = SkyLabController.getFollowMode();
        expect(followMode).toEqual("off");
    });
});
*/