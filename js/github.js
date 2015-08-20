"use strict";

var xhr = new XMLHttpRequest();
var wng_server;
var wng_game;
var commits=[];

if (xhr) {
  xhr.onreadystatechange=function()
  {
  if (this.readyState==4 && this.status==200)
    {
    //document.getElementById("github").innerHTML=this.responseText;
    wng_server = JSON.parse(this.responseText);
    console.log(wng_server);
    next();
    }
  }
  xhr.open("GET","https://api.github.com/repos/wiggles-nextgen/wng-server/commits",true);
  xhr.send(null);
}

function next () {
  xhr.onreadystatechange=function()
  {
  if (this.readyState==4 && this.status==200)
    {
    //document.getElementById("github").innerHTML=this.responseText;
    wng_game = JSON.parse(this.responseText);
    console.log(wng_game);
    combine();
    }
  }
  xhr.open("GET","https://api.github.com/repos/wiggles-nextgen/wng-game/commits",true);
  xhr.send(null);
}

function combine() {
  var i=0;
  var ig=0;
  var is=0;
  while (i < (wng_game.length + wng_server.length)) {
    var g;
    var s;
//    console.log("i"+i);
//    console.log("ig"+ig);
//    console.log("is"+is);

    if(ig < wng_game.length)
      g = new Date(wng_game[ig].commit.author.date);
    else
      g = new Date(wng_game[ig-1].commit.author.date);
    if(is < wng_server.length)
      s = new Date(wng_server[is].commit.author.date);
    else
      s = new Date(wng_server[is-1].commit.author.date);

//    console.log(g > s);
//    console.log(g);
//    console.log(s);
    commits[i]={};
    if (g > s && ig !== wng_game.length) {
      commits[i].type="game";
      commits[i].date=g;
      commits[i].message=wng_game[ig].commit.message;
      commits[i].author=wng_game[ig].author.login;
      ig++;
      i++;
    } else if (g < s && is !== wng_server.length) {
      commits[i].type="server";
      commits[i].date=s;
      commits[i].message=wng_server[is].commit.message;
      commits[i].author=wng_server[is].author.login;
      is++;
      i++;
    } else if (ig < wng_game.length) {
      commits[i].type="game";
      commits[i].date=g;
      commits[i].message=wng_game[ig].commit.message;
      commits[i].author=wng_game[ig].author.login;
      ig++;
      i++;
    } else {
      commits[i].type="server";
      commits[i].date=s;
      commits[i].message=wng_server[is].commit.message;
      commits[i].author=wng_server[is].author.login;
      is++;
      i++;
    }
  }
  drawCommits();
}

function drawCommits() {
  console.log(commits);
  for (var d in commits){
    document.getElementById("github").innerHTML+=commits[d].author + " -> ";
    document.getElementById("github").innerHTML+=commits[d].type;
    document.getElementById("github").innerHTML+=" ( "+commits[d].message + " ) / ";
    document.getElementById("github").innerHTML+=commits[d].date + "</br>";
  }
}
