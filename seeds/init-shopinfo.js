exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('shopinfo').del()
    .then(function () {
      // Inserts seed entries
      return knex('shopinfo').insert([
        {id: 1, _clientid: 1, address: "Shop No. 102A & 102B, 1st Floor, Shopping Arcade of Convention Plaza, Wanchai, Hong Kong", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: "Do you like the shop?" , question3: "Do you agree that the staff is nice?",
        question4: "Upload your shop image" , shopname: "Godiva Hong Kong-Convention Plaza", credit: 50, quota: 10, description:'Some test shop',taken:[84,34]},
        {id: 2, _clientid: 1, address: "Shop No. 14, G/F, Yip Fung Building, 14-18 D'Aguilar Street, Central, Hong Kong", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: "Do you like the shop?" , question3: "Do you agree that the staff is nice?",
        question4: "Upload your shop image" , shopname: "Godiva Hong Kong-14 D'Aguilar Street", credit: 50, quota: 10, description:'3ofeoep'},
        {id: 3, _clientid: 1, address: "Shop No. 14, G/F, Yip Fung Building, 14-18 D'Aguilar Street, Central, Hong Kong", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: "Do you like the shop?" , question3: "Do you agree that the staff is nice?",
        question4: "Upload your shop image" , shopname: "Godiva Hong Kong-14 D'Aguilar Street", credit: 50, quota: 10, description:'Srksnf'},
        {id: 4, _clientid: 1, address: "Shop No. 14, G/F, Yip Fung Building, 14-18 D'Aguilar Street, Central, Hong Kong", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: "Do you like the shop?" , question3: "Do you agree that the staff is nice?",
        question4: "Upload your shop image" , shopname: "Godiva Hong Kong-14 D'Aguilar Street", credit: 50, quota: 10, description:'Sorrp'},
        {id: 5, _clientid: 2, address: "Shop No. 14, G/F, Yip Fung Building, 14-18 D'Aguilar Street, Central, Hong Kong", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: "Do you like the shop?" , question3: "Do you agree that the staff is nice?",
        question4: "Upload your shop image" , shopname: "Godiva Hong Kong-14 D'Aguilar Street", credit: 50, quota: 10, description:'Some test shop'},
        {id: 6, _clientid: 2, address: "Shop No. 14, G/F, Yip Fung Building, 14-18 D'Aguilar Street, Central, Hong Kong", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: "Do you like the shop?" , question3: "Do you agree that the staff is nice?",
        question4: "Upload your shop image" , shopname: "Godiva Hong Kong-14 D'Aguilar Street", credit: 50, quota: 10, description:'S9798p'},
        {id: 7, _clientid: 1, address: "Shop No. 14, G/F, Yip Fung Building, 14-18 D'Aguilar Street, Central, Hong Kong", startdate: "2018-12-01", enddate: "2018-12-30", 
        question1: "What the shop look like?" , question2: "Do you like the shop?" , question3: "Do you agree that the staff is nice?",
        question4: "Upload your shop image" , shopname: "Godiva Hong Kong-14 D'Aguilar Street", credit: 50, quota: 10, description:'Some test shop797979'}
        
      ]);
    });
};
