
var tmp_handles=typeof SK_GALLERY_AUTO_SLIDE_HANDLES=='undefined'?undefined:SK_GALLERY_AUTO_SLIDE_HANDLES;SK_GALLERY_AUTO_SLIDE_HANDLES={};if(typeof tmp_handles!='undefined'){SK_GALLERY_AUTO_SLIDE_HANDLES=tmp_handles;}
function NullLoader(){this.Load=function(){}}
function BasicSlideFactory(){this.CreateSlide=function(element){element.loaded=false;element.Show=function(){$(element).setStyle('z-index','100');$(element).setStyle('opacity','1.0');$(element).setStyle('margin','0 auto');var parent_id=this.get('parent_id');var placeholders=$$('.placeholder'+parent_id);var prev_placeholder=null;var next_placeholder=null;var curr_idx=parseInt(this.get('curr_idx'));for(var i=0;i<placeholders.length;i++){var placeholder_idx=parseInt(placeholders[i].get('curr_idx'));if(placeholder_idx==curr_idx-1){prev_placeholder=placeholders[i];}
if(placeholder_idx==curr_idx){next_placeholder=placeholders[i];}}
['before','after'].each(function(item){var wrapper=$('sk_gallery_placeholder_wrapper'+parent_id+'_'+item);if(wrapper&&wrapper.childNodes.length>0){for(var i=0;i<wrapper.childNodes.length;i++){var child=wrapper.childNodes[i]
if(child.hasClass&&child.hasClass('placeholder'+parent_id)){var cloned=child;cloned.setStyle('display','none');$('gallery_images_placeholder'+parent_id).appendChild(cloned);}}}
var placeholder=item=='before'?prev_placeholder:next_placeholder;if(wrapper&&placeholder){var cloned=placeholder;cloned.setStyle('display','block');wrapper.appendChild(cloned);}});}
element.Hide=function(){this.style.visibility='hidden';$(this).setStyle('opacity','0.0');$(this).setStyle('z-index','1');}
element.Load=function(){if(this.IsLoaded())return;var images=this.getElementsByTagName('img');if(images){for(var i=0;i<images.length;i++){if(images[i].getAttribute('realSrc')){images[i].src=images[i].getAttribute('realSrc');this.loaded=true;break;}}}}
element.IsLoaded=function(){return this.loaded;}
element.Reset=function(){}
return element;}}
function Slideshow(id,slide_factory,loader){this.id=id;this.auto_slide_obj=null;this.supports_trans=false;this.slide_factory=slide_factory;this.loader=loader;this.Init=function(){this.container=document.getElementById(this.id);this.filter=this.container.getAttribute('slideShowFilter');this.slides=new Array();var ie_pos=navigator.appVersion.toLowerCase().indexOf('msie');if(ie_pos>-1){var ie_version=parseFloat(navigator.appVersion.substring(ie_pos+5,navigator.appVersion.indexOf(';',ie_pos)));this.supports_trans=ie_version>5&&this.filter?true:false;}else if(navigator.appName.toLowerCase().indexOf('netscape')>-1){this.simulates_trans=true;}
this.current=0;}
this.CreateSlidesFromHTML=function(){for(var i=0;i<this.container.childNodes.length;i++){var element=this.container.childNodes[i];if(element.tagName&&element.tagName.toLowerCase()=='div'&&(element.className=='gallery-slide'||element.className=='gallery-firstSlide')){this.slides[this.slides.length]=this.slide_factory.CreateSlide(element);}}}
this.CreateSlidesFromNodeIDs=function(node_ids){for(var i=0;i<node_ids.length;i++){this.slides[i]=this.slide_factory.CreateSlide(node_ids[i]);this.container.appendChild(this.slides[i]);}}
this.Resize=function(new_width,new_height){for(var i=0;i<this.slides.length;i++){this.slides[i].Resize(new_width,new_height);}
this.container.style.width=new_width+"px";this.container.style.height=new_height+"px";}
this.Position=function(left,top){this.container.style.left=left+"px";this.container.style.top=top+"px";}
this.Center=function(av_width,av_height,padding){this.Position(padding/2,padding/2);this.Resize(av_width-padding,av_height-padding);}
this.Slide=function(){if(!this.slides.length)return;if(!this.slides[this.next].IsLoaded()){this.loader.Load(this.slides,[this.next]);}
if(this.auto_slide_obj){this.auto_slide_obj.Reset();}
this.slides[this.next].Load();if(this.supports_trans){this.container.style.filter='progid:DXImageTransform.Microsoft.'+this.filter+'(duration=1,overlap=0.75)';if(this.container.filters.length)this.container.filters[0].Apply();}else if(this.simulates_trans){this.ApplyTransition();}
this.slides[this.current].Hide();this.slides[this.next].Reset();this.slides[this.next].Show();if(this.supports_trans&&this.container.filters.length){this.container.filters[0].Play();}else if(this.simulates_trans){this.PlayTransition();}
this.current=this.next;var self=this;var f=function(){self.Preload();}
window.setTimeout(f,20);}
this.ApplyTransition=function(){if(this.filter=='Fade'){this.container.style.mozOpacity='0.0';this.container.style.opacity='0.0';}}
this.PlayTransition=function(){if(this.filter=='Fade'){var opacity=0.0;var opacity_step=0.1;var self=this;var fade_func=function(){if(opacity>1.0){self.container.style.mozOpacity=1.0;self.container.style.opacity=1.0;return;}
self.container.style.mozOpacity=opacity;self.container.style.opacity=opacity;opacity+=opacity_step;window.setTimeout(fade_func,50);}
fade_func();}}
this.Preload=function(){var need_preload=new Array();var seen=new Array();var nr_preload=20;var cur_offset=this.current-this.current%nr_preload;for(var i=1;i<nr_preload+1;i++){var slide_idx=cur_offset+i;if(slide_idx>=this.slides.length){slide_idx%=this.slides.length;}else if(slide_idx<0){slide_idx=this.slides.length-1+(slide_idx%this.slides.length);}
if(seen[slide_idx]||this.slides[slide_idx].IsLoaded())continue;seen[slide_idx]=1;var next=need_preload.length;need_preload[next]=slide_idx;}
if(need_preload.length)this.loader.Load(this.slides,need_preload);this.slides[this.GetNextIdx()].Load();this.slides[this.GetPrevIdx()].Load();}
this.GetNextIdx=function(){return this.current>=(this.slides.length-1)?0:this.current+1;}
this.GetPrevIdx=function(){return this.next=this.current<=0?this.slides.length-1:this.current-1;}
this.Next=function(){this.next=this.GetNextIdx();this.Slide();}
this.Prev=function(){this.next=this.GetPrevIdx();this.Slide();}
this.JumpTo=function(i){this.next=i<0||i>this.slides.length-1?0:i;this.Slide();}
this.SetAutoSlide=function(auto_slide_obj){this.auto_slide_obj=auto_slide_obj;}
this.GetAutoSlide=function(){return this.auto_slide_obj;}}
function Autoslide(instance,nav_object,delay){this.instance=instance;this.nav_object=nav_object;this.delay=delay;this.timer=null;this.running=false;this.Start=function(){if(!this.delay)return;if(this.IsRunning())this.Stop();this.running=true;this.timer=window.setInterval(this.instance+'.Run()',this.delay*1000);}
this.Stop=function(){this.running=false;if(this.timer){window.clearInterval(this.timer);}}
this.Reset=function(){var was_running=this.IsRunning();this.Stop();if(was_running)this.Start();}
this.IsRunning=function(){return this.running;}
this.SetDelay=function(delay){this.delay=delay;this.Reset();}
this.GetDelay=function(){return this.delay;}
this.Run=function(){this.nav_object.Next();}}
function AutoslideControl(auto_slide_obj,gallery_node_id){this.auto_slide_obj=auto_slide_obj;this.gallery_node_id=gallery_node_id;SK_GALLERY_AUTO_SLIDE_HANDLES[gallery_node_id]=this;this.Configure=function(pause_btn_id,run_btn_id){this.pause_btn_id=pause_btn_id;this.run_btn_id=run_btn_id;}
this.Init=function(auto_start){this.pause_btn=document.getElementById(this.pause_btn_id);this.run_btn=document.getElementById(this.run_btn_id);this.auto_start=$defined(auto_start)?auto_start:false;this.RefreshSlideShowButton();}
this.RefreshSlideShowButton=function(){if(!this.pause_btn||!this.run_btn)return;if(!this.auto_slide_obj){this.pause_btn.style.display='none';this.run_btn.style.display='none';}else if(this.auto_slide_obj.IsRunning()){this.pause_btn.style.display='block';this.run_btn.style.display='none';}else{this.pause_btn.style.display='none';this.run_btn.style.display='block';}}
this.Resume=function(){if(this.auto_slide_obj){this.auto_slide_obj.Start();this.RefreshSlideShowButton();}}
this.Pause=function(){if(this.auto_slide_obj){this.auto_slide_obj.Stop();this.RefreshSlideShowButton();}}
this.SetDelay=function(delay){if(this.auto_slide_obj){this.auto_slide_obj.SetDelay(delay);this.Resume();}}
this.GetDelay=function(){if(this.auto_slide_obj){return this.auto_slide_obj.GetDelay();}
return 0;}}
function GetSlideshowHandle(node_id){if($defined(SK_GALLERY_AUTO_SLIDE_HANDLES[node_id]))
return SK_GALLERY_AUTO_SLIDE_HANDLES[node_id];return null;}
function PauseAllSlideshows(node_id){var handle=GetSlideshowHandle(node_id);if(handle)handle.Pause();}
function ResumeAllSlideshows(node_id){var handle=GetSlideshowHandle(node_id);if(handle&&handle.auto_start)handle.Resume();}


function SSNavButtons(instance,slide_show_obj){this.slide_show_obj=slide_show_obj;this.instance=instance;this.nr_images=0;this.Add=function(){this.nr_images++;}
this.Configure=function(curr_page_container_id){this.curr_page_container_id=curr_page_container_id}
this.Init=function(){this.auto_slide_obj=slide_show_obj.GetAutoSlide();this.curr_page_container=document.getElementById(this.curr_page_container_id);this.current_image=0;this.RefreshCurrentPageLabel();}
this.RefreshCurrentPageLabel=function(){this.curr_page_container.innerHTML=(this.current_image+1)+' of '+this.nr_images;}
this.JumpTo=function(i){this.current_image=i;this.slide_show_obj.JumpTo(this.current_image);this.RefreshCurrentPageLabel();}
this.Prev=function(){var next=this.current_image<=0?this.nr_images-1:this.current_image-1;this.JumpTo(next);}
this.Next=function(){var next=this.current_image>=this.nr_images-1?0:this.current_image+1;this.JumpTo(next);}}


function SSComments(instance,slide_show_obj){this.slide_show_obj=slide_show_obj;this.instance=instance;this.img_props=new Array();this.links=new Array();this.MAX_STRING_LEN=20;this.Configure=function(container_id){this.container_id=container_id}
this.Init=function(){this.container=document.getElementById(this.container_id);this.current_selected=0;this.current_offset=0;this.end_pos=0;this.UpdateComments();this.SetSelected(this.current_selected);}
this.UpdateComments=function(){for(var i=0;i<this.img_props.length;i++){var link=document.createElement('a');link.href='javascript:'+this.instance+'.JumpTo('+i+')';link.className='plain';var label=this.ShortenString(this.img_props[i].alt);link.appendChild(document.createTextNode(label));link.style.whiteSpace='nowrap';this.container.appendChild(link);if(i!=(this.img_props.length-1)){var space=document.createElement('span');space.innerHTML=' &nbsp;&nbsp; ';this.container.appendChild(space);}
this.links[i]=link;}}
this.SetSelected=function(i){this.links[this.current_selected].style.fontWeight='normal';this.links[this.current_selected].className='plain';this.current_selected=i;this.links[this.current_selected].style.fontWeight='bold';}
this.ShortenString=function(str){if(str.length>this.MAX_STRING_LEN){str=str.substring(0,this.MAX_STRING_LEN)+'...';}
return str;}
this.Prev=function(){var next=this.current_selected<=0?this.img_props.length-1:this.current_selected-1;this.JumpTo(next);}
this.Next=function(){var next=this.current_selected>=this.img_props.length-1?0:this.current_selected+1;this.JumpTo(next);}
this.JumpTo=function(next){this.SetSelected(next);this.slide_show_obj.JumpTo(this.current_selected);}
this.Add=function(img_props){var next=this.img_props.length;this.img_props[next]=img_props;if(typeof(this.img_props[next].alt)=='undefined'||this.img_props[next].alt==''){this.img_props[next].alt=(next+1);}}}


function SSFilmStrip(instance,slide_show_obj){this.slide_show_obj=slide_show_obj;this.instance=instance;this.img_props=new Array();this.cells=new Array();this.AppendToStrip=function(thumb){var cell=document.createElement('td');cell.width=thumb.width;cell.height=thumb.height;cell.appendChild(thumb);cell.className='filmStripCell';this.cells[this.cells.length]=cell;if(this.vertical){var row=document.createElement('tr');row.appendChild(cell);this.film_strip.childNodes[0].appendChild(row);}else{this.film_strip.childNodes[0].childNodes[0].appendChild(cell);}}
this.Configure=function(container_id,pending_images,temp_image){this.id=container_id;this.pending_images=pending_images;this.temp_image=temp_image;}
this.Init=function(){this.strip=document.getElementById(this.id);this.vertical=this.strip.getAttribute('vertical')=='true'?true:false;this.width=parseInt(this.strip.getAttribute('thumbWidth'));this.height=parseInt(this.strip.getAttribute('thumbHeight'));this.film_strip=document.createElement('table');this.film_strip.className='filmStripContainer';this.film_strip.appendChild(document.createElement('tbody'));this.strip.appendChild(this.film_strip);if(!this.vertical){var row=document.createElement('tr');this.film_strip.childNodes[0].appendChild(row);}
this.current_offset=0;this.current_selected=0;var img_ref=new Array();for(var i=0;i<this.img_props.length;i++){var name=this.id+"_image_"+i;var image=document.createElement('img');image.width=this.width;image.height=this.height;image.className='filmStripImage';image.setAttribute('sequenceIndex',i);image.setAttribute('instanceName',this.instance);image.setAttribute('id',name);image.setAttribute('name',name);image.setAttribute('daid',this.img_props[i].daid);var self=this;image.onclick=function(){eval(this.getAttribute('instanceName')+'.JumpTo('+this.getAttribute('sequenceIndex')+')');}
image.onload=function(){self.pending_images.UnregisterPendingImage(this.getAttribute('name'));}
image.onerror=function(){self.pending_images.RegisterPendingImage(this.getAttribute('id'),this.getAttribute('daid'),self.temp_image);}
this.AppendToStrip(image);img_ref[i]=image;}
this.SetSelected(this.current_selected);this.strip.style.overflow='hidden';for(var i=0;i<img_ref.length;i++){img_ref[i].src=this.img_props[i].src;}
var self=this;var repeating_function=function(){self.InitStripSizes();}
if(document.all&&navigator.appVersion.indexOf("MSIE ")!=-1){window.setTimeout(function(){self.strip.style.overflow='visible';self.strip.style.overflow='hidden';},1000);}
window.setInterval(repeating_function,1000);}
this.InitStripSizes=function(){this.strip=document.getElementById(this.id);this.bar_width=this.strip.clientWidth;this.bar_height=this.strip.clientHeight;if(this.vertical){this.length=this.bar_height;}else{this.length=this.bar_width;}
if(typeof this.film_strip=='undefined')return;if(this.vertical){this.strip_length=this.film_strip.offsetHeight;}else{this.strip_length=this.film_strip.offsetWidth;}
this.max_offset=this.strip_length-this.length;this.Refresh();}
this.SetSelected=function(i){this.cells[this.current_selected].className='filmStripCell';this.current_selected=i;this.cells[this.current_selected].className='filmStripCellSelected';}
this.Add=function(img_props){var next=this.img_props.length;this.img_props[next]=img_props;}
this.Refresh=function(){var slice_len=this.current_offset+this.length;var layer_border=-this.current_offset;if(this.vertical){this.film_strip.style.clip='rect('+this.current_offset+'px, auto, '+slice_len+'px, 0px)';this.film_strip.style.top=layer_border+"px";}else{this.film_strip.style.clip='rect(0px, '+slice_len+'px, auto, '+this.current_offset+'px)';this.film_strip.style.left=layer_border+"px";}}
this.SlideLeft=function(){this.InitStripSizes();this.direction=-1;this.SlideStart();}
this.SlideRight=function(){this.InitStripSizes();this.direction=1;this.SlideStart();}
this.SlideUp=this.SlideLeft;this.SlideDown=this.SlideRight;this.SlideStart=function(){window.clearTimeout(this.timer);if(this.strip_length<this.length)
return;this.end_pos=this.current_offset+this.direction*0.7*this.length;if(this.end_pos<0)
this.end_pos=0;if(this.end_pos>this.max_offset)
this.end_pos=this.max_offset
this.step=100;this.Slide();}
this.Slide=function(){this.step*=0.5;var next_step=this.current_offset+this.direction*(15+this.step);if(((this.direction>0)&&(next_step>this.end_pos))||((this.direction<0)&&(next_step<this.end_pos))){this.current_offset=this.end_pos;this.Refresh();return;}
this.current_offset=next_step;this.Refresh();this.timer=window.setTimeout(this.instance+'.Slide()',75);}
this.JumpTo=function(i){if(this.length==0){this.InitStripSizes();}
this.SetSelected(i);this.slide_show_obj.JumpTo(i);}
this.IsVisible=function(next){var nr=this.img_props.length;if(!nr)return false;var avg_width=this.strip_length/nr;if((next*avg_width+avg_width)>(this.current_offset+this.length)){return false;}
return true;}
this.Next=function(){var next=this.current_selected>=(this.img_props.length-1)?0:this.current_selected+1;if(!this.IsVisible(next)){this.SlideRight();}else if(0==next){this.current_offset=0;this.Refresh();}
this.JumpTo(next);}}


function SSNavNumbers(instance,slide_show_obj){this.slide_show_obj=slide_show_obj;this.instance=instance;this.nr_images=0;this.Configure=function(container_id,small){this.container_id=container_id
this.small=small;}
this.Init=function(){this.container=document.getElementById(this.container_id);var table=document.createElement('table');table.cellPadding=0;table.cellSpacing=0;table.className=this.small?'numbered_small_nav_table':'numbered_nav_table';table.appendChild(document.createElement('tbody'));this.length=parseInt(this.container.getAttribute('length'));this.cell_size=parseInt(this.container.getAttribute('cellSize'));this.cells_per_row=this.length/this.cell_size;this.rows=Math.floor(this.nr_images/this.cells_per_row)+1;this.current_selected=0;this.links=new Array();for(var i=0,y=0;i<this.nr_images&&y<this.rows;y++){var row=document.createElement('tr');row.className='plain';for(var x=0;x<this.cells_per_row;x++,i++){var cell=document.createElement('td');if(i<this.nr_images){cell.className='fb_outline';cell.align='center';cell.style.cursor='pointer';var box=document.createElement('div');box.className=this.small?'plainsmall':'plain';var link=document.createElement('a');link.href='javascript:void(null);';link.innerHTML=i+1;link.className=this.small?'plainsmall':'plain';link.setAttribute('sequenceIndex',i);link.setAttribute('instanceName',this.instance);cell.setAttribute('sequenceIndex',i);cell.setAttribute('instanceName',this.instance);link.onclick=cell.onclick=function(){eval(this.getAttribute('instanceName')+'.JumpTo('+this.getAttribute('sequenceIndex')+')');if(!e)var e=window.event;if(e){e.cancelBubble=true;if(e.stopPropagation)e.stopPropagation();}}
box.appendChild(link);cell.appendChild(box);this.links[this.links.length]=cell;}
row.appendChild(cell);}
table.childNodes[0].appendChild(row);}
this.container.appendChild(table);this.JumpTo(this.current_selected);}
this.JumpTo=function(i){if(!this.links.length)return;this.links[this.current_selected].firstChild.className=this.small?'plainsmall':'plain';this.links[this.current_selected].firstChild.firstChild.className=this.small?'plainsmall':'plain';this.current_selected=i;this.links[this.current_selected].firstChild.className=this.small?'numberedSmallNavSelected':'numberedNavSelected';this.links[this.current_selected].firstChild.firstChild.className=this.small?'plainsmall':'plain';this.slide_show_obj.JumpTo(i);}
this.Next=function(){var next=this.current_selected>=(this.nr_images-1)?0:this.current_selected+1;this.JumpTo(next);}
this.Add=function(){this.nr_images++;}}

