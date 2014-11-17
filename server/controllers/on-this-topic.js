'use strict';

var ft = require('../utils/api').ft;

module.exports = function(req, res, next) {
    ft.get([req.params.id])
        .then(function(thisArticle) {
            var topic, query;
            if(thisArticle && thisArticle.length) {
                thisArticle = thisArticle[0];
            } else {
                res.status(404).send();
            }
            topic = thisArticle[req.params.metadata];
            if(!topic) {
                res.status(404).send();
            }

            query = topic.taxonomy + ':' + topic.name;

            ft.search(query, 4)
            .then(function (results) {
                var ids;
                var articles = results ? results.articles : [];
                if (articles[0] instanceof Object) {
                    ids = articles.map(function (article) {
                        return article.id;
                    });
                } else {
                    ids = articles; // FIXME when is this ever not a Object?
                }
                ft.get(ids)
                    .then( function (articles) {
                        articles = articles.filter(function(article) {
                            return article.id !== thisArticle.id;
                        });

                    if (articles.length > 0) {
                        require('../utils/cache-control')(res);
                        res.render('components/on-this-topic', {
                            mode: 'expand',
                            stream: articles,
                            query: query,
                            title: 'More from this topic - ' + topic.name
                        });
                    } else {
                        res.status(404).send();
                    }
                }, function (err) {
                    console.error(err);
                });

            }, function (err) {
                console.error(err);
            });
    }, function (err) {
        console.error(err);
    }).end();
};
