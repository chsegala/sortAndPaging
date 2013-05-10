SortAndPaging pre-alpha
=======================

AngularJS module to make remote sort and paging.

Simple module to include and allows remote table sort and paging using JSON. 
It's a pre-alpha release, it needs a lot of features and tweaks but it works and it's easy.

##Prerequisites
You NEED AngularJS (duh!) and bootstrap (not really, but it's usefull).

Bootstrap isn't really needed, but you should provide '.icon-arrow-up' and '.icon-arrow-down' CSS classes with the
images with the sorting.

##Quickstart
Include the file

    <script src="path/to/file/pagingAndSorting.js" type="text/javascript"><!-- --></script>

On your application.js you should inject this new module

    myApp = angular.module('myApp', ['pagingAndSorting']);
    
And you're ready to go!

##Usage
###Sorting
To make the sorting, just mark the `<th>` for the column with the atrtibute `sort-column` and pass out
the property wich should be sorted by. Sorting is always 'ASC' then 'DESC'.

    <table>
      <tr>
        <th sort-column="'name'">Name</th>
        <th sort-column="'age'">Age</th>
      </tr>
      <tr ng-repeat="your repeat function">
      </tr>
    </table>

###Paging
The paging is a element called `<pages></pages>`, it's the only thing you should put to make the paging works.
It uses the `btn-group` bootstrap's class and the inner buttons the `btn` class.

###In the end
you should have a beautiful table like this
    <div>
      <table>
        <tr>
          <th sort-column="'name'">Name</th>
          <th sort-column="'age'">Age</th>
        </tr>
        <tr ng-repeat="your repeat function">
        </tr>
      </table>
      <pages></pages>
    </div>

###Server Side
On the server you should recieve another parameter for your call called `pageable`, this object looks like this:

    pageable = {
       page_number: 1,
       page_size: 10
    }
    
You'll have to implement this in your server-side language, and it also expects your response to be like:

    {
      contents: [],     //the array of elements returned
      total: 100,       //the total amount of records within the query
      pageable:{
        page_number: 1, //the returned page's number
        page_size: 10   //the page's size
      }
    }
    
Having setted up your server-side, put the attributes and the element, now you turned your boring old table into the
super paged and sorted table your table always wanted to be

##Drawback
You can only have 1 sorted and paged table per controller.

I hope this can be usefull to someone!
