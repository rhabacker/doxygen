/*
 @licstart  The following is the entire license notice for the JavaScript code in this file.

 The MIT License (MIT)

 Copyright (C) 1997-2020 by Dimitri van Heesch

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 and associated documentation files (the "Software"), to deal in the Software without restriction,
 including without limitation the rights to use, copy, modify, merge, publish, distribute,
 sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or
 substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 @licend  The above is the entire license notice for the JavaScript code in this file
 */

function initResizable() {
  let sidenav,navtree,content,header,footer,barWidth=6;
  const RESIZE_COOKIE_NAME = '$PROJECTID'+'width';

  function resizeWidth() {
    const sidenavWidth = $(sidenav).outerWidth();
    content.css({marginLeft:parseInt(sidenavWidth)+"px"});
    if (typeof page_layout!=='undefined' && page_layout==1) {
      footer.css({marginLeft:parseInt(sidenavWidth)+"px"});
    }
    Cookie.writeSetting(RESIZE_COOKIE_NAME,sidenavWidth-barWidth);
  }

  function restoreWidth(navWidth) {
    content.css({marginLeft:parseInt(navWidth)+barWidth+"px"});
    if (typeof page_layout!=='undefined' && page_layout==1) {
      footer.css({marginLeft:parseInt(navWidth)+barWidth+"px"});
    }
    sidenav.css({width:navWidth + "px"});
  }

  function resizeHeight() {
    const headerHeight = header.outerHeight();
    const footerHeight = footer.outerHeight();
    const windowHeight = $(window).height();
    let contentHeight,navtreeHeight,sideNavHeight;
    if (typeof page_layout==='undefined' || page_layout==0) { /* DISABLE_INDEX=NO */
      contentHeight = windowHeight - headerHeight - footerHeight;
      navtreeHeight = contentHeight;
      sideNavHeight = contentHeight;
    } else if (page_layout==1) { /* DISABLE_INDEX=YES */
      contentHeight = windowHeight - footerHeight;
      navtreeHeight = windowHeight - headerHeight;
      sideNavHeight = windowHeight;
    }
    content.css({height:contentHeight + "px"});
    navtree.css({height:navtreeHeight + "px"});
    sidenav.css({height:sideNavHeight + "px"});
    if (location.hash.slice(1)) {
      (document.getElementById(location.hash.slice(1))||document.body).scrollIntoView();
    }
  }

  function collapseExpand() {
    let newWidth;
    if (sidenav.width()>0) {
      newWidth=0;
    } else {
      const width = Cookie.readSetting(RESIZE_COOKIE_NAME,$TREEVIEW_WIDTH);
      newWidth = (width>$TREEVIEW_WIDTH && width<$(window).width()) ? width : $TREEVIEW_WIDTH;
    }
    restoreWidth(newWidth);
    const sidenavWidth = $(sidenav).outerWidth();
    Cookie.writeSetting(RESIZE_COOKIE_NAME,sidenavWidth-barWidth);
  }

  header  = $("#top");
  sidenav = $("#side-nav");
  content = $("#doc-content");
  navtree = $("#nav-tree");
  footer  = $("#nav-path");
  $(".side-nav-resizable").resizable({resize: () => resizeWidth() });
  $(sidenav).resizable({ minWidth: 0 });
  $(window).resize(() => resizeHeight());
  const device = navigator.userAgent.toLowerCase();
  const touch_device = device.match(/(iphone|ipod|ipad|android)/);
  if (touch_device) { /* wider split bar for touch only devices */
    $(sidenav).css({ paddingRight:'20px' });
    $('.ui-resizable-e').css({ width:'20px' });
    $('#nav-sync').css({ right:'34px' });
    barWidth=20;
  }
  const width = Cookie.readSetting(RESIZE_COOKIE_NAME,$TREEVIEW_WIDTH);
  if (width) { restoreWidth(width); } else { resizeWidth(); }
  resizeHeight();
  const url = location.href;
  const i=url.indexOf("#");
  if (i>=0) window.location.hash=url.substr(i);
  const _preventDefault = (evt) => evt.preventDefault();
  $("#splitbar").bind("dragstart", _preventDefault).bind("selectstart", _preventDefault);
  $(".ui-resizable-handle").dblclick(collapseExpand);
  $(window).on('load',resizeHeight);
}
/* @license-end */
