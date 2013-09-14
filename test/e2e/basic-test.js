/*global describe, it, expect, beforeEach, browser, element */

"use strict";

describe("E2E: Testing ConPA home", function () {

    beforeEach(function  () {
        browser().navigateTo('/');
    });

    it('should get six sections', function () {
        var h2Els = element('h2'),
            h2Texts = h2Els.text();

        expect(h2Els.count()).toBe(6);
        expect(h2Texts).toContain('Basket');
        expect(h2Texts).toContain('Charts');
        expect(h2Texts).toContain('Asset Stats');
        expect(h2Texts).toContain('Latest Portfolios');
        expect(h2Texts).toContain('Best Portfolios');
        expect(h2Texts).toContain('Worst Portfolios');
    });

});
