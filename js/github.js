"use strict";

var xhr = new XMLHttpRequest();
var wng_server;
var wng_game;
var wng_website;
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

function next() {
  xhr.onreadystatechange=function()
  {
  if (this.readyState==4 && this.status==200)
    {
    wng_game = JSON.parse(this.responseText);
    console.log(wng_game);
    next2();
    }
  }
  xhr.open("GET","https://api.github.com/repos/wiggles-nextgen/wng-game/commits",true);
  xhr.send(null);
}

function next2() {
  xhr.onreadystatechange=function()
  {
  if (this.readyState==4 && this.status==200)
    {
    wng_website = JSON.parse(this.responseText);
    console.log(wng_game);
    combine();
    }
  }
  xhr.open("GET","https://api.github.com/repos/wiggles-nextgen/Wiggles-nextGen.github.io/commits",true);
  xhr.send(null);
}

function combine() {
  var i=0;
  for (var g in wng_game) {
    commits[i]={};
    commits[i].date=new Date(wng_game[g].commit.author.date);
    commits[i].type="game";
    commits[i].message=wng_game[g].commit.message;
    commits[i].author=wng_game[g].author.login;
    i++;
  }
  for (var s in wng_server) {
    commits[i]={};
    commits[i].date=new Date(wng_server[s].commit.author.date);
    commits[i].type="server";
    commits[i].message=wng_server[s].commit.message;
    commits[i].author=wng_server[s].author.login;
    i++;
  }
  for (var w in wng_website) {
    commits[i]={};
    commits[i].date=new Date(wng_website[w].commit.author.date);
    commits[i].type="website";
    commits[i].message=wng_website[w].commit.message;
    commits[i].author=wng_website[w].author.login;
    i++;
  }
  commits = commits.sort(function(a,b) {
    return a.date < b.date;
  });
  drawCommits();
}

function drawCommits() {
  var today = new Date();
  console.log(commits);
  for (var d in commits){
    var date=Math.floor((today-commits[d].date) / (1000*60*60*24));
    document.getElementById("github").innerHTML+=commits[d].author + " -> ";
    document.getElementById("github").innerHTML+=commits[d].type;
    document.getElementById("github").innerHTML+=" ( "+commits[d].message + " ) / ";
    if (date == 0) {
      date=Math.floor((today-commits[d].date) / (1000*60*60));
      document.getElementById("github").innerHTML+="vor "+date + " Std</br>";
    } else {
      document.getElementById("github").innerHTML+="vor "+date + " Tagen</br>";
    }
  }
}
