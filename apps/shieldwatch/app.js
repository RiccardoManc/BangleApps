var Layout = require("Layout");

var btnWidth = g.getWidth()/3;
var code = "";
var code_checked=false;

var mac_address_Puck = 'c8:54:e3:7b:79:9a random';
var mac_address_MDBT42Q = 'ee:cf:90:e0:f4:f9 random';

check_code = new Layout( {
  type:"v", c: [
    {type:"txt", font:"15%", label:"You entered:", filly:0.5},
    {type:"txt", font:"20%", label:"", id:"code", filly:0.5},
    {type:"v", c: [
      {type:"btn", font:"15%", label:'Check', id:'check', filly:1, cb: l=>checkCode(), width:g.getWidth(), btnFaceCol:"#7ba05b"},
      {type:"btn", font:"15%", label:'Try again', id:'try-again', cb: l=>tryAgain(), filly:1, width:g.getWidth(), btnFaceCol:"#cd5c5c"}
    ]},
  ]
});

checking = new Layout( {
  type:"v", c: [
    {type:"h", filly:1, fillx:1, c: [
      {type:"img", pad:2, src:atob("MDDCAP//AAAAAAAAAAVVVVVVVVVVVVAAAAVVVVVVVVVVVVAAAAAFAAAAAAAAUAAAAAAFAAAAAAAAUAAAAAAFAAAAAAAAUAAAAAAFAAAAAAAAUAAAAAAFAAAAAAAAUAAAAAAFAAAAAAAAUAAAAAAFAFVVVVUAUAAAAAAFAFVVVVUAUAAAAAAFAFAAAAUAUAAAAAAFAFAAAAUAUAAAAAAFABQAABQAUAAAAAAFQBUAAFQBUAAAAAABQAVAAVABQAAAAAABUABUFQAFQAAAAAAAUAAVVAAFAAAAAAAAFAAFUAAUAAAAAAAAFQABQABUAAAAAAAAAVAAAAFQAAAAAAAAAFQAABUAAAAAAAAAABQAABQAAAAAAAAAAAUAAFAAAAAAAAAAAAUAAFAAAAAAAAAAAAUAAFAAAAAAAAAAAAUAAFAAAAAAAAAAABQAABQAAAAAAAAAAFQAABUAAAAAAAAAAVAAAAFQAAAAAAAAFQAAAABUAAAAAAAAFAAAAAAUAAAAAAAAUAAAAAAFAAAAAAABUAAAAAAFQAAAAAABQAABQAABQAAAAAAFQAAFUAABUAAAAAAFAAAVVAAAUAAAAAAFAABUFUAAUAAAAAAFAAVAAVAAUAAAAAAFABUAAFQAUAAAAAAFABQAABQAUAAAAAAFAFAAAAUAUAAAAAAFAFAAAAUAUAAAAAAFAFAAAAUAUAAAAAAFAFAAAAUAUAAAAAAFAFAAAAUAUAAAAAAFAFAAAAUAUAAAAAVVVVVVVVVVVVAAAAVVVVVVVVVVVVAA") },
    ]},
    {type:"txt", font:"13%", label:"Checking...", filly:1, fillx:1, id:"result", wrap:true},
  ]
});

deviceNotFound = new Layout( {
  type:"v", bgCol: "#FFF", c: [
    {type:"h", filly:1, fillx:1, c: [
      {type:"img", pad:2, src:atob("MjLCAP//AAAAAAAAAAAAAAABVAAAAAAAAAAAAAAAVVAAAAAAAAAAAAAAFQVAAAAAAAAAAAAABUAVAAAAAAAAAAAAAVAAVAAAAAAAAAAAAFQAAVAAAAAAAAAAABUAAAVAAAAAAAAAAAVAAAAVAAAAAAAAAAFQAAAAVAAAAAAAAABUAAAAAVAAAAAAAAAVAAAAAAVAAAAAAAAFQAAAAAAVAAAAAAABUAAAAAAAVAAAAAAAVAAAAAAAAVAAAAAAFQAAAVAAAAVAAAAABUAAABVAAAAVAAAAAVAAAAFUAAAAVAAAAFQAAAAVQAAAAVAAABUAAAABVAAAAAVAAAVAAAAAFUAAAAAVAAFQAAAAAVQAAAAAVABUAAAAABVAAAAAAVAVAAAAAAFUAAAAAAVFQAAAAAAVQAAAAAAVUAAAAAABVAAAAAAAVQAAAAAAFUAAAAAABVQAAAAAAVQAAAAAAVFQAAAAABVAAAAAAFQFQAAAAAFQAAAAABUAFQAAAAAAAAAAAAVAAFQAAAAAAAAAAAFQAAFQAAAAAAAAAABUAAAFQAAAAAAAAAAVAAAAFQAAABVAAAAFQAAAAFQAAAFUAAABUAAAAAFQAAAVQAAAVAAAAAAFQAAAAAAAFQAAAAAAFQAAAAAABUAAAAAAAFQAAAAAAVAAAAAAAAFQAAAAAFQAAAAAAAAFQAAAABUAAAAAAAAAFQAAAAVAAAAAAAAAAFQAAAFQAAAAAAAAAAFQAABUAAAAAAAAAAAFQAAVAAAAAAAAAAAAFQAFQAAAAAAAAAAAAFQBUAAAAAAAAAAAAAFQVAAAAAAAAAAAAAAFVQAAAAAAAAAAAAAAFUAAAAAAAA==")},
    ]},
    {type:"txt", font:"13%", label:"Main device not found", filly:1, fillx:1, wrap:true},
  ]
});

monitoring = new Layout( {
  type:"v", c: [
    {type:"h", filly:1, fillx:1, c: [
      {type:"img", pad:6, src:require("heatshrink").decompress(atob("ikUwYFCgVJkgMDhMkyVJAwQFCAQNAgESAoQCBwEBBwlIgAFDpNkyAjDkm/5MEBwdf+gUEl/6AoVZkmX/oLClv6pf+DQn1/4+E3//0gFBkACBv/SBYI7D5JiDLJx9CBAR4CAoWQQ4Z9DgAA==")) },
      {type:"txt", font:"13%", label:"ENABLED"}
    ]},
    {type:"txt", font:"12%", label:"", filly:1, fillx:1, id:"gesture", wrap:true},
    {type:"txt", font:"13%", label:"Monitoring...", filly:1, id:"footer"},
  ]
});

numpad = new Layout( {
    type:"v", c: [
      {type:"h", c: [
        {type:"btn", font:"25%", label:'1', cb: l=>onKeyPad(1), id:'1', width:btnWidth, filly:1 },
        {type:"btn", font:"25%", label:'2', cb: l=>onKeyPad(2), id:'2', width:btnWidth, filly:1 },
        {type:"btn", font:"25%", label:'3', cb: l=>onKeyPad(3), id:'3', width:btnWidth, filly:1 },
      ]},
      {type:"h", filly:1, c: [
        {type:"btn", font:"25%", label:'4', cb: l=>onKeyPad(4), id:'4', width:btnWidth, filly:1 },
        {type:"btn", font:"25%", label:'5', cb: l=>onKeyPad(5), id:'5', width:btnWidth, filly:1 },
        {type:"btn", font:"25%", label:'6', cb: l=>onKeyPad(6), id:'6', width:btnWidth, filly:1 },
      ]},
      {type:"h", filly:1, c: [
        {type:"btn", font:"25%", label:'7', cb: l=>onKeyPad(7), id:'7', width:btnWidth, filly:1 },
        {type:"btn", font:"25%", label:'8', cb: l=>onKeyPad(8), id:'8', width:btnWidth, filly:1 },
        {type:"btn", font:"25%", label:'9', cb: l=>onKeyPad(9), id:'9', width:btnWidth, filly:1 },
      ]},
    ]
    });

var rssi_values=[];
var intervalId;
var monitoring_gesture=false;

var service;
var gatt;
var connected=false;

NRF.setTxPower(4);

function errorManager(error){
  E.showMessage(error,{
    title:"Error",
    img:atob("FBQBAfgAf+Af/4P//D+fx/n+f5/v+f//n//5//+f//n////3//5/n+P//D//wf/4B/4AH4A=")
  });
  setTimeout(()=>{
    E.showMessage();
    check_code.code.label = code;
    check_code.render();
    check_code.setUI();
  }, 5000);
}

function connectToMainDevice(){
  NRF.connect(mac_address_MDBT42Q).then(function(g) {
    gatt=g;
    return g.getPrimaryService("180D");
  }).then(function(s) {
    service=s;
    console.log("CONNECTED");
    connected=true;
    tryAgain();
  }).catch(function(e) {
    deviceNotFound.render();
    deviceNotFound.setUI();
  });
}

function checkConnection(){
  setInterval(()=>{
    if(gatt && gatt.connected){
      console.log("CONNECTED");
      connected=true;
    }else {
      connected=false;
      console.log("NOT CONNECTED");
      NRF.requestDevice({timeout:2000, filters:[{id:mac_address_MDBT42Q}]}).then(function(device) {
        connectToMainDevice();
      }).catch(function(e) {
        deviceNotFound.render();
        deviceNotFound.setUI();
      });

    }
  }, 4000);
}

checkConnection();

function tryAgain() {
  Bangle.buzz(100,0.7);
  numpad.render();
  numpad.setUI();
  code='';
}

function checkCode() {
  Bangle.buzz(100,0.7);
  check_code.clear();
  checking.render();
  checking.setUI();
  service.getCharacteristic("5678").then(function(c) {
    return c.writeValue(code);
  }).then(function(d) {
    console.log("Value written");
  }).then(function(){
    return service.getCharacteristic("1234");
  }).then(function(c) {
    c.on('characteristicvaluechanged', function(event) {
      if(JSON.stringify(event.target.value.buffer)=="[1]"){
        showResult("ENABLED");
        console.log("ENABLED");
        setTimeout(()=>{
          code_checked=true;
          clearResult();
          checking.clear();
          monitoring.render();
          monitoring.setUI();
        }, 3000);
      }else {
        showResult("NOT ENABLED");
        console.log("NOT ENABLED");
        code_checked=false;
        setTimeout(()=>{
          clearResult();
          checking.clear();
          tryAgain();
        }, 3000);
      }
    });
    return c.startNotifications();
  }).then(function(d) {
    console.log("Waiting for notifications");
  }).catch(function(e) {
    errorManager(e);
  });
}

function onKeyPad(key) {
  Bangle.buzz(80,0.4);
  console.log(key);
  code += key;
  if(code.length == 5){
    numpad.clear();
    check_code.code.label = code;
    check_code.render();
    check_code.setUI();
  }
}

function checkProximity() {
  try{
    NRF.requestDevice({ timeout:5000, filters: [{id: mac_address_Puck}]}).then(function(device){
      rssi_values.push(device.rssi);
      Bangle.buzz(100, 1);
    }).catch(function(e) {
      rssi_values = [-99, -99, -99, -99, -99];
      console.log("ERROR",e);
    });
  }catch(e){
    console.log(e);
  }
}

function dpiNotInRange(){
  rssi_values=[];
  clearInterval(intervalId);
  clearGesture();
  errorManager('DPI not in range');
  service.getCharacteristic("1122").then(function(c) {
    return c.writeValue("1");
  }).then(function(d) {
    console.log("TOGGLE RELE");
  }).catch(function(e) {
    console.log(e);
  });
  code_checked=false;
}

function dpiInRange(){
  rssi_values=[];
  clearInterval(intervalId);
  service.getCharacteristic("1122").then(function(c) {
    return c.writeValue("0");
  }).then(function(d) {
    console.log("TOGGLE RELE");
  }).catch(function(e) {
    console.log(e);
  });
}

function clearResult(){
  checking.clear(checking.result);
  checking.result.label = "Checking...";
  checking.render(checking.result);
}

function showResult(result){
  checking.clear(checking.result);
  checking.result.label = result;
  checking.render(checking.result);
}

function clearGesture(){
  monitoring.clear(monitoring.gesture);
  monitoring.gesture.label="";
  monitoring.update(monitoring.gesture);
}

function showAction(action){
  monitoring.clear(monitoring.footer);
  monitoring.footer.label = action;
  monitoring.render(monitoring.footer); 
}

function monitorGesture(gesture){
  if(gesture=='jackhammer'){
    monitoring_gesture=true;
    showAction('Check DPI...');
    intervalId = setInterval(() => {
      if(rssi_values.length<60) {
        checkProximity();
      }else {
        console.log(rssi_values);
        monitoring_gesture=false;
        showAction('Monitoring...');
        clearGesture();
        var average = rssi_values.reduce((a, b) => a + b) / rssi_values.length;
        console.log(`The average is: ${average}.`);
        if(average<-70){
          dpiNotInRange();
        }else {
          dpiInRange();
        }
      }
    }, 2000);
  }
}

Bangle.on('aiGesture',(gesture)=>{
  if(code_checked && !monitoring_gesture && connected){
    monitorGesture(gesture);
    monitoring.clear(monitoring.gesture);
    monitoring.gesture.label = gesture+' detected';
    monitoring.render(monitoring.gesture);
    console.log(gesture);
  }
});
