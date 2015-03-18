/*global describe, it, beforeEach*/
'use strict';

var $ = require('cheerio');
require('chai').should();
var nock = require('nock');

var images = require('../../server/transforms/images');
var imageSet = require('fs').readFileSync('tests/fixtures/image-set.json', { encoding: 'utf8' });
var imageSet2 = require('fs').readFileSync('tests/fixtures/image-set-2.json', { encoding: 'utf8' });

describe('Images', function () {

	beforeEach(function () {
		nock('http://api.ft.com', {
				reqheaders: {
					'X-Api-Key': process.env.api2key
				}
			})
			.get('/content/f14a7e9e-cc08-11e4-30d3-978e959e1c97?sjl=WITH_RICH_CONTENT')
			.reply(200, imageSet)
			.get('/content/2ad940b2-cc01-11e4-30d3-978e959e1c97?sjl=WITH_RICH_CONTENT')
			.reply(200, imageSet2)
			.get('/content/7a68fee4-cc22-11e4-20ac-978e959e1c97?sjl=WITH_RICH_CONTENT')
			.reply('404');
	});

	it('should convert an ft-content to an image', function () {
		var $content = $.load('');
		$content.root().append(
			'<ft-content data-embedded="true" type="http://www.ft.com/ontology/content/ImageSet" url="http://api.ft.com/content/f14a7e9e-cc08-11e4-30d3-978e959e1c97"></ft-content>'
		);

		return images($content)
			.then(function ($content) {
				$content.html().should.equal(
					'<figure class="article__image-wrapper ng-pull-out ng-inline-element article__main-image">' +
						'<img class="article__image" src="//image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Ff14a7e9e-cc08-11e4-aeb5-00144feab7de?width=470&amp;source=next&amp;fit=scale-down" srcset="//image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Ff14a7e9e-cc08-11e4-aeb5-00144feab7de?width=470&amp;source=next&amp;fit=scale-down 1x, //image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Ff14a7e9e-cc08-11e4-aeb5-00144feab7de?width=940&amp;source=next&amp;fit=scale-down 2x">' +
						'<figcaption class="article__image-caption">American staples old and new: from top, Campbell&#x2019;s Soup, hot dogs and kale. Below, Annie&#x2019;s Homegrown co-founder Annie Withey</figcaption>' +
					'</figure>'
				);
			});
	});

	it('should convert multiple ft-content to images', function () {
		var $content = $.load('');
		$content.root().append(
			'<ft-content data-embedded="true" type="http://www.ft.com/ontology/content/ImageSet" url="http://api.ft.com/content/f14a7e9e-cc08-11e4-30d3-978e959e1c97"></ft-content>' +
			'<ft-content data-embedded="true" type="http://www.ft.com/ontology/content/ImageSet" url="http://api.ft.com/content/2ad940b2-cc01-11e4-30d3-978e959e1c97"></ft-content>'
		);

		return images($content)
			.then(function ($content) {
				$content.html().should.equal(
					'<figure class="article__image-wrapper ng-pull-out ng-inline-element article__main-image">' +
						'<img class="article__image" src="//image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Ff14a7e9e-cc08-11e4-aeb5-00144feab7de?width=470&amp;source=next&amp;fit=scale-down" srcset="//image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Ff14a7e9e-cc08-11e4-aeb5-00144feab7de?width=470&amp;source=next&amp;fit=scale-down 1x, //image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Ff14a7e9e-cc08-11e4-aeb5-00144feab7de?width=940&amp;source=next&amp;fit=scale-down 2x">' +
						'<figcaption class="article__image-caption">American staples old and new: from top, Campbell&#x2019;s Soup, hot dogs and kale. Below, Annie&#x2019;s Homegrown co-founder Annie Withey</figcaption>' +
					'</figure>' +
					'<figure class="article__image-wrapper ng-pull-out ng-inline-element article__inline-image">' +
						'<img class="article__image" src="//image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2F2ad940b2-cc01-11e4-aeb5-00144feab7de?width=470&amp;source=next&amp;fit=scale-down" srcset="//image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2F2ad940b2-cc01-11e4-aeb5-00144feab7de?width=470&amp;source=next&amp;fit=scale-down 1x, //image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2F2ad940b2-cc01-11e4-aeb5-00144feab7de?width=940&amp;source=next&amp;fit=scale-down 2x">' +
					'</figure>'
				);
			});
	});

	it('should remove ft-content if image request fails', function () {
		var $content = $.load('');
		$content.root().append(
			'<ft-content data-embedded="true" type="http://www.ft.com/ontology/content/ImageSet" url="http://api.ft.com/content/f14a7e9e-cc08-11e4-30d3-978e959e1c97"></ft-content>' +
			'<ft-content data-embedded="true" type="http://www.ft.com/ontology/content/ImageSet" url="http://api.ft.com/content/7a68fee4-cc22-11e4-20ac-978e959e1c97"></ft-content>'
		);

		return images($content)
			.then(function ($content) {
				$content.html().should.equal(
					'<figure class="article__image-wrapper ng-pull-out ng-inline-element article__main-image">' +
						'<img class="article__image" src="//image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Ff14a7e9e-cc08-11e4-aeb5-00144feab7de?width=470&amp;source=next&amp;fit=scale-down" srcset="//image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Ff14a7e9e-cc08-11e4-aeb5-00144feab7de?width=470&amp;source=next&amp;fit=scale-down 1x, //image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Ff14a7e9e-cc08-11e4-aeb5-00144feab7de?width=940&amp;source=next&amp;fit=scale-down 2x">' +
						'<figcaption class="article__image-caption">American staples old and new: from top, Campbell&#x2019;s Soup, hot dogs and kale. Below, Annie&#x2019;s Homegrown co-founder Annie Withey</figcaption>' +
					'</figure>'
				);
			});
	});

});