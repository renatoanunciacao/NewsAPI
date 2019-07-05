function Model(){
    this.country = $('#country').val();
    this.apiKey = '6ab24537215f4bbb921cef9d67e06f1f';     
    this.urlApi = "https://newsapi.org/v2/top-headlines?country="+ this.country +"&apiKey="+this.apiKey;
    this.getData();   
}

Model.prototype.getData = function(){
    $.ajax({
        url : this.urlApi
    }).done($.proxy(function(data){
        this.otherData = data;
        $.publish('Model.otherData', data)
    }, this));
}

function View(){
    $.subscribe('Controller.renderData.View', this.renderData.bind(this));
}

View.prototype.renderData = function(e, articles){
    moment.locale('pt-br'); 
    var html = '';
    for(var i = 0; i < articles.articles.length; i++){
        html += '<div class="col-md-4">';
        html += '<div class="card mb-4 shadow-sm">';
        if(articles.articles[i].urlToImage !== null){
            html += '<img class="bd-placeholder-img card-img-top" src='
            html += articles.articles[i].urlToImage + ' alt="">';
        }
        html += '<p class="card-text jumbotron-heading text-center"><b>'+articles.articles[i].title+'</b></p>';
        html += '<div class="card-body">';
        if(articles.articles[i].content !== null){
            html += '<p class="card-text">' + articles.articles[i].content + '</p>';
        }
        html += '<div class="d-flex justify-content-between align-items-center">';
        html += '<div class="btn-group">';
        html += '<a href=' + articles.articles[i].url+ ' target="_blank"><button type="button" class="btn btn-sm btn-outline-secondary">Mais Informações</button></a>';
        html += '</div><small class="text-muted">'+ moment(articles.articles[i].publishedAt).format('LLL')+'</small>';
        html += '</div>';
        html += '</div></div></div>';    
    }
    $('#posts').append(html);
}

function Controller(){
    this.Model = new Model;
    this.View = new View;
    $.subscribe('Model.otherData.Controller', this.dataReceived.bind(this));
}

Controller.prototype.dataReceived = function(e, data){
    $.publish('Controller.renderData', data);
}

var AppCtrl = new Controller;