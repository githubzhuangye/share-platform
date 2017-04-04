import React, { Component, PropTypes } from 'react';
import { Steps, Button, Tabs, Icon, Form, Input, Checkbox } from 'antd';
import ajax from "@fdaciuk/ajax";
import { USER_TYPE,host } from 'config/constants';

const { RETAILER, BRANDLER, MIYA } = USER_TYPE;

export  function  pwdValicode(requestData,callback){
        ajax({
            method:"post",
            url:`${host}/cp/market/saas!pwdValicode.action`,
            data:requestData,
            headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }).then(function(data){
            callback(data);
        }).catch(function(error){
            console.log(error);
        })
    }   
export  function resetPwd(requestData,callback){
        ajax({
            method:"post",
            url:`${host}/cp/market/saas!resetPwd.action`,
            data:requestData,
            headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }        
         }).then(function(data){  
            callback(data);
        }).catch(function(error){ 
            console.log(error);             
        })   
    }      
                                     