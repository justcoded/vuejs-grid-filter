var express = require('express');
var app = express();
var cors = require('cors');

var posts = require('./data/posts');

app.use(cors());

function applyFilters(searchData, posts) {
  var filterData = searchData.filter;

  return filterData ? posts.filter(function (post) {
    var filterKey, filterValue;
    var filtersPassCount = 0;

    for(filterKey in filterData) {
      filterValue = filterData[filterKey].split(',');

      if (filterKey === 'title') {
        if (post[filterKey].indexOf(filterValue[0]) === -1) {
          return false;
        }
      } else {
        if (filterValue.indexOf(post[filterKey].toString()) === -1) {
          return false;
        }
      }

      filtersPassCount++;
    }

    return filtersPassCount === Object.keys(filterData).length;
  }) : posts;
}

function applySorting(searchData, posts) {
  var sortData = searchData.sort;
  var sortedPosts = posts.slice();
  var sortOrder;

  for(var sortKey in sortData) {
    sortOrder = sortData[sortKey];

    sortedPosts = sortedPosts.sort(function (a, b) {
      var leftValue = a[sortKey].length || a[sortKey];
      var rightValue = b[sortKey].length || b[sortKey];

      return sortOrder === 'asc' ? leftValue - rightValue : rightValue - leftValue;
    });
  }

  return sortedPosts;
}

function applyPagination(searchData, posts) {
  if (!searchData.p || !searchData.pp) {
    return posts;
  }

  var page = parseInt(searchData.p) - 1;
  var perPage = parseInt(searchData.pp);

  return posts.slice(page * perPage, page * perPage + perPage);
}

app.get('/posts', function (req, res) {
  var searchData = req.query;

  var normalizedPosts = applySorting(searchData, applyFilters(searchData, posts));

  var response = {
    total: normalizedPosts.length,
    items: applyPagination(searchData, normalizedPosts)
  };

  res.json(response);
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`App listening on port ${port}`);
});

