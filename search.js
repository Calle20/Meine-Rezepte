function Search(){
    searchInput=document.getElementById("searchinput")
    console.log(location.href.replace("add.html", "search.html"));
    location.replace=location.href.replace("add.html?", "search.html") || location.href.replace("index.html?", "search.html") ||location.href.replace("search.html?", "search.html")
}