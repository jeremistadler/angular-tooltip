Angular Tooltip
===============

Very simple Angularjs tooltip without any dependencies


### Usage

Add the files and add the module 'tooltip' to your app:

    angular.module('myApp', ['tooltip'])
    

Then start using the directive like:

    <div tooltip="'Simple text'"></div>
    <div tooltip="'The text'" placement="top"></div>
    <div tooltip="somevariable" placement="left"></div>
    <div tooltip="somefunction()" placement="right" tip-margin="20"></div>
    <div tooltip="'Some other text'" placement="bottom" tip-margin="0"></div>
	
	
	
####Parameters

* **tooltip**: the text
* **placement**: right,left,top or bottom (default 'top')
* **margin**: change the margin (default 5px)
