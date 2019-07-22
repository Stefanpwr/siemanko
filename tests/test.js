QUnit.test("GetWeightTest", function (assert) {
    var result= [{IdKlienta: 1, Waga: 90, data_pomiaru:2019-04-30},{IdKlienta: 1, Waga: 85, data_pomiaru:2019-04-26}]


    for(var i=0; i < result.length; i++)
    {
        weight = result[i].Waga;
        parseInt(weight,10);

        data = result[i].data_pomiaru.toString();

        weight_tab[i]= weight;
        data_tab[i]=data;
    }
    assert.equal(weight_tab.length, 2,"Length should be 2");
    
});