---
title: "Content Service view"
sidebar_label: "Content Service view"
sidebar_position: 3
metaTitle: "This is the meta title tag for Content Service view page"
metaDescription: "This is the meta description for Content Service views page"
---



![Content Service](/img/ContentService.png)
![Content ServiceDB](/img/ContentServiceDB.png)

## Data contracts

### Queries

> getCompainList

``` javascript
// input
{
  "includeTask": Boolean
	"compainId": Strnig // filter for Compain
}

// output
[
{
	"id": String,
	"title": Sting,
	"description": String,
	"tasks": []String, //() TaskIdStirng
},
// {...}, {...}, ...
]

```


> getTaskContent

``` javascript
// input
// pass parameter for taskID to query params in url
{"taskId": String} // String -> TaskIdStirng

// output
{
	"title": Sting,
	"description": String,
}

```
