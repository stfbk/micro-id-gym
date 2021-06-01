function changeTarget() {
  if (document.getElementById('targetWild').checked) {
    $("#sandboxContainerChoice").css("display", "none");
    $("#sutCreate").css("display", "none");
    $("#sutUpload").css("display", "none");
  } else {
      $("#sandboxContainerChoice").css("display", "flex");
      changeSandboxType();
  }
}

function changeSandboxType() {
  if (document.getElementById('createIdm').checked) {
    $("#sutCreate").css("display", "block");
    $("#sutUpload").css("display", "none");
  } else {
    $("#sutCreate").css("display", "none");
    $("#sutUpload").css("display", "block");
  }
}

function changeProtocol(){
  selectedObject = document.getElementById("protocol");
  selectedProtocol = selectedObject[selectedObject.selectedIndex].value;

  clearBadges();
  if(selectedProtocol == "saml") {
    // $('#migOAuthPurpose').css("display", "none");
    $('#idpOAuthVersion').css("display", "none");
    $('#clientOAuthVersion').css("display", "none");
    // $('#migSAMLPurpose').css("display", "inline-block");
    $('#idpSAMLVersion').css("display", "inline-block");
    $('#clientSAMLVersion').css("display", "inline-block");
    changeIdPSAML();
    changeClientSAML();
  } else {
    // $('#migSAMLPurpose').css("display", "none");
    $('#idpSAMLVersion').css("display", "none");
    $('#clientSAMLVersion').css("display", "none");
    // $('#migOAuthPurpose').css("display", "inline-block");
    $('#idpOAuthVersion').css("display", "inline-block");
    $('#clientOAuthVersion').css("display", "inline-block");
    $("#clientOAuthVersion").prop("disabled", true);
    changeIdPOAuth();
  }
}


function clearBadges() {
  displayAttack("impersonification", false);
  displayAttack("billion-laughs", false);
  displayAttack("xss", false);
  displayAttack("csrf", false);
  displayAttack("unknown", false);
}

function disableEntitySelection(value, protocol) {
  $("#idp" + protocol + "Version").prop("disabled", value);
  $("#client" + protocol + "Version").prop("disabled", value);
}

var selectedIdPSAML = "3.3.3-sanitized";
var selectedClientSAML = "canonicalization-vuln";
var selectedIdPOAuth = "secure";

function changeIdPSAML() {
  fillClientSAMLAttack(selectedClientSAML, true);
  fillIdPSAMLAttack(selectedIdPSAML, false);
  selectedObject = document.getElementById("idpSAMLVersion");
  selectedIdPSAML = selectedObject[selectedObject.selectedIndex].value;
  fillIdPSAMLAttack(selectedIdPSAML, true);
  if(selectedClientSAML == "relaystate-sanitized" || selectedIdPSAML == "3.3.3-sanitized"){
    displayAttack("xss", false);
    displayAttack("csrf", false);
    displayAttack("unknown", true);
  }
}

function fillIdPSAMLAttack(idpName, selected) {
  switch(idpName) {
    case "3.3.3-sanitized":
      displayAttack("unknown", selected);
      break;
    default:
      displayAttack("xss", selected);
      displayAttack("csrf", selected);
      break;
  }
}

function changeClientSAML() {
  fillIdPSAMLAttack(selectedIdPSAML, true);
  fillClientSAMLAttack(selectedClientSAML, false);
  selectedObject = document.getElementById("clientSAMLVersion");
  selectedClientSAML = selectedObject[selectedObject.selectedIndex].value;
  fillClientSAMLAttack(selectedClientSAML, true);
  if(selectedIdPSAML == "3.3.3-sanitized" || selectedClientSAML == "relaystate-sanitized"){
    displayAttack("xss", false);
    displayAttack("csrf", false);
    displayAttack("unknown", true);
  }
}

function fillClientSAMLAttack(clientName, selected) {
  switch(clientName) {
    case "secure":
      displayAttack("unknown", selected);
      break;
    case "relaystate-vuln":
      displayAttack("xss", selected);
      displayAttack("csrf", selected);
      break;
    case "relaystate-sanitized":
      displayAttack("unknown", selected);
      break;
    case "canonicalization-vuln":
      displayAttack("impersonification", selected);
      break;
    case "billion-laughs":
      displayAttack("billion-laughs", selected);
      break;
  }
}



function changeIdPOAuth() {
  fillIdPOAuthAttack(selectedIdPOAuth, false);
  selectedObject = document.getElementById("idpOAuthVersion");
  selectedIdPOAuth = selectedObject[selectedObject.selectedIndex].value;
  fillIdPOAuthAttack(selectedIdPOAuth, true);
  if(selectedIdPOAuth == "1" || selectedIdPOAuth == "0") {
    $('#clientOAuthVersion').val("keycloak");
    $("#testerUsername").prop("disabled", true);
    $("#testerUsername").prop("value", "demouser");
    $("#testerPassword").prop("disabled", true);
    $("#testerPassword").prop("value", "demouser");
} else {
    $('#clientOAuthVersion').val("mitreid");
    $("#testerUsername").prop("disabled", false);
    $("#testerUsername").prop("value", "user");
    $("#testerPassword").prop("disabled", false);
    $("#testerPassword").prop("value", "password");
  }

}

function fillIdPOAuthAttack(idpName, selected) {
  switch(idpName) {
    case "redirect-vuln":
    case "1":
      displayAttack("xss", selected);
      displayAttack("csrf", selected);
      break;
    case "secure":
    case "0":
      displayAttack("unknown", selected);
      break;
  }
}

function displayAttack(attackName, value){
  if(value)
    $('#badge-' + attackName).css("display", "inline-block");
  else
    $('#badge-' + attackName).css("display", "none");
}

function generateZip() {
  selectedObject = document.getElementById("protocol");
  selectedProtocol = selectedObject[selectedObject.selectedIndex].value;
  if(selectedProtocol == "saml") {
    disableEntitySelection(false, "SAML");
    disableEntitySelection(true, "OAuth");
  } else {
    disableEntitySelection(false, "OAuth");
    disableEntitySelection(true, "SAML");
    $("#testerUsername").prop("disabled", false);
    $("#testerPassword").prop("disabled", false);
  }
  $('#configForm').submit();
  $('#submitButton').css("display", "none");
  $('#loadingSpinner').css("margin-top", "30px");
  $('#loadingSpinner').css("visibility", "visible");

}
