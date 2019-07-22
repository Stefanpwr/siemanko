var test = require('unit.js');
var obj = {
    IdKlienta : 'data',
Waga : 'waga'
};
function Objec(data, waga) {
    this.data = data;
    this.waga =waga;
}
var obj1 = new Objec(20,90);
var obj2 = new Objec(25,85);
var obj3 = new Objec(30,83);
var result = [];
result.push(obj1);
result.push(obj2);
result.push(obj3);
var weight;
var data;
var weight_tab = [];
var data_tab = [];
for(var i=0; i < result.length; i++)
{
    weight = result[i].Waga;
    parseInt(weight,10);

    data = result[i].data.toString();

    weight_tab[i]= weight;
    data_tab[i]=data;
}
test.must
//(weight_tab.length, 3, "Length of weight_tab");