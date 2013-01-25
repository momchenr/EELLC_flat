
function GIPopup(self,url,rec_width,rec_height,bg_color,options){var screen_hor_padding=30;var screen_vert_padding=50;var width;var height;if(screen.width<rec_width+screen_hor_padding){width=screen.width-screen_hor_padding;}else{width=rec_width;}
if(screen.height<rec_height+screen_vert_padding){height=screen.height-screen_vert_padding;}else{height=rec_height;}
if(bg_color==''){bg_color=GetComputedStyle(document.body,'background-color');}
var curr_idx=0;for(var curr=self;curr;curr=curr.parentNode){if(curr&&curr.getAttribute&&null!=curr.getAttribute('curr_idx')){curr_idx=curr.getAttribute('curr_idx');break;}}
var enc=document.all?document.charset:document.characterSet;url+="&popup_width="+width+"&popup_height="+height+"&bg_color="+escape(bg_color)
+"&encoding="+escape(enc)+"&curr_idx="+curr_idx;SKPopup(url,width,height,options);}
function GetComputedStyle(o,style){if(typeof(document.defaultView)!='undefined'){if(typeof(document.defaultView.getComputedStyle)=='function'&&document.defaultView.getComputedStyle(o,'')!=null){return document.defaultView.getComputedStyle(o,'').getPropertyValue(style);}}else if(typeof(o.currentStyle)!='undefined'){var i=0;while((i=style.indexOf('-',i))!=-1){style=style.substring(0,i)+style.charAt(i+1).toUpperCase()+style.substring(i+2,style.length);i++;}
return eval('o.currentStyle.'+style);}
return'';}
function GetComputedStyleInt(o,style){var computedStyle=GetComputedStyle(o,style);return"undefined"==typeof(computedStyle)||""==computedStyle||null==computedStyle?0:parseInt(computedStyle)}
function GetColor(o,style){var css=GetComputedStyle(o,style);var css_str=new String(css);mozilla_color=new RegExp("rgb\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)",'i');ie_color=new RegExp("([\\dA-F]{2})([\\dA-F]{2})([\\dA-F]{2})",'i');var c=new Array();c[0]=c[1]=c[2]=127;if(mozilla_color.exec(css_str)){c[0]=RegExp.$1;c[1]=RegExp.$2;c[2]=RegExp.$3;}else if(ie_color.exec(css_str)){c[0]=parseInt(RegExp.$1,16);c[1]=parseInt(RegExp.$2,16);c[2]=parseInt(RegExp.$3,16);;}
return c;}
function SelectedIconURL(link_id,base_url){var c=GetColor(document.getElementById(link_id),'color');return base_url+'/r='+c[0]+'/g='+c[1]+'/b='+c[2];}
if(!$defined(SK.Actions.Gallery))SK.Actions.Gallery={};SK.Actions.Gallery.onPlaceholderDisplay=function(meta,placeholder_id){var table=$('slideshow_table'+meta.node_id);if(table){PauseAllSlideshows(meta.node_id);var new_width=table.get('ph_width');if(table.getSize().x<new_width){table.set('width',new_width);}}else{SK.Actions.Gallery.manageRealEstate(meta,'block','10');}}
SK.Actions.Gallery.onPlaceholderHide=function(meta,placeholder_id){var table=$('slideshow_table'+meta.node_id);if(table){ResumeAllSlideshows(meta.node_id);table.set('width','');}else{SK.Actions.Gallery.manageRealEstate(meta,'none','1');}}
SK.Actions.Gallery.manageRealEstate=function(meta,display,width){var table=$('thumbnails_table'+meta.node_id);if(!table)return;var total_images=parseInt(table.get('total_images'));for(var i=1;i<total_images+1;i++){var id='space'+meta.node_id+'_'+i;var before=$(id+'_before');var after=$(id+'_after');if(before)before.setStyle('display',display);if(after)after.setStyle('display',display);id='placeholder'+meta.node_id+'_'+i;before=$(id+'_before');after=$(id+'_after');if(before)before.set('width',width);if(after)after.set('width',width);}}


var PENDING_IMAGES_CHECK_TIMEOUT=10000;var MAX_DAIDS_PER_REQUEST=100;if(typeof(PENDING_IMAGES_MANAGERS)=='undefined'){PENDING_IMAGES_MANAGERS=new Array();}
function PendingImages(iframe_name)
{this.Images=new Array();this.IFrameName=iframe_name;this.GetReadyImagesCount=PendingImages__GetReadyImagesCount;this.GetPendingImagesCount=PendingImages__GetPendingImagesCount;this.GetAllImagesCount=PendingImages__GetAllImagesCount;this.AskRDAM=PendingImages__AskRDAM;this.RegisterPendingImage=PendingImages__RegisterPendingImage;this.UnregisterPendingImage=PendingImages__UnregisterPendingImage;PENDING_IMAGES_MANAGERS[this.IFrameName]=this;window.setInterval('PendingImages__Run( "'+this.IFrameName+'" );',PENDING_IMAGES_CHECK_TIMEOUT);}
function PendingImages__Run(iframe_name)
{var mgr=PENDING_IMAGES_MANAGERS[iframe_name];if(typeof(mgr)=='undefined'){return;}
if(mgr.GetAllImagesCount()>0){var daids=new Array();for(var i=0;i<mgr.GetAllImagesCount();i++){if(mgr.Images[i].Ready==false){if(daids.length>MAX_DAIDS_PER_REQUEST)break;daids[daids.length]=mgr.Images[i].DAID;}}
if(daids.length>0){mgr.AskRDAM(daids);}}}
function PendingImages__AskRDAM(daids)
{var iframe=document.getElementById(this.IFrameName);if(iframe&&typeof(iframe)!='undefined'){var url=iframe.src;var query_begin=url.indexOf('?');if(query_begin!=-1){url=url.substring(0,query_begin);}
iframe.src=url+'?'+'daids='+escape(daids.join(","))+'&'+'name='+escape(this.IFrameName);}}
function PendingImages__RDAMCallback(iframe_name,image_urls)
{if(typeof(PENDING_IMAGES_MANAGERS[iframe_name])=='undefined'){return;}
var manager=PENDING_IMAGES_MANAGERS[iframe_name];for(var i=0;i<manager.GetAllImagesCount();i++){if(manager.Images[i].Ready==false){var images=document.getElementsByName(manager.Images[i].Name);if(!images||!images.length||!images[0]){continue;}
var img=images[0];if(img){var url=image_urls[manager.Images[i].DAID];if(typeof(url)!='undefined'){img.src=url;}}}}}
function PendingImages__GetReadyImagesCount()
{var ready_images_count=0;for(var i=0;i<this.GetAllImagesCount();i++){if(this.Images[i].Ready){ready_images_count++;}}
return ready_images_count;}
function PendingImages__GetPendingImagesCount()
{return this.GetAllImagesCount()-this.GetReadyImagesCount();}
function PendingImages__GetAllImagesCount()
{return this.Images.length;}
function PendingImages__RegisterPendingImage(image_name,daid,tmp_url)
{var images=document.getElementsByName(image_name);if(!images||!images.length||!images[0]){return;}
var image=images[0];for(var i=0;i<this.GetAllImagesCount();i++){if(this.Images[i].Name==image_name){if(image.src.indexOf(tmp_url)==-1)
image.src=tmp_url;return;}}
var new_image_index=this.GetAllImagesCount();this.Images[new_image_index]=new Object();this.Images[new_image_index].Name=image_name;this.Images[new_image_index].DAID=daid;this.Images[new_image_index].Ready=false;this.Images[new_image_index].TmpURL=tmp_url;if(image.src.indexOf(tmp_url)==-1)
image.src=tmp_url;}
function PendingImages__UnregisterPendingImage(image_name)
{for(var i=0;i<this.GetAllImagesCount();i++){if(this.Images[i].Name==image_name){var images=document.getElementsByName(image_name);if(!images||!images.length||!images[0]){continue;}
var image=images[0];if(image.src.indexOf(this.Images[i].TmpURL)==-1)
this.Images[i].Ready=true;break;}}}

