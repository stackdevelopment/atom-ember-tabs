'use babel';
import fs from "fs";

export default class GoToggle {

  constructor() {
    this.curentWorkspace = atom.workspace;
  }

  //-1: Something else
  // 0:"Controller",
  // 1:"Route",
  // 2:"Template"
  // 3:"ComponentJS",
  // 4:"ComponentTemplate",

  toggle(hard) {
    var toggledPath = this.toggledFilePath();
    if(toggledPath){
      var fileExists = fs.existsSync(toggledPath);
      if(fileExists){
        try {
          atom.workspace.open(toggledPath, {pending:!hard, searchAllPanes:true});
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  _currentItem() {
    let currentItem = this.curentWorkspace.getActivePaneItem();
    if (currentItem) {
      return currentItem;
    } else {
      throw 'No open pane';
    }
  }


  //-1: Something else
  // 0:"Controller",
  // 1:"Route",
  // 2:"Template"
  // 3:"ComponentJS",
  // 4:"ComponentTemplate",
  transformPath(fromType, toType){
    var origPath = this._openFilePath(),
    newPath;

    if (fromType === 0){
      // if(toType === 1){
      //   //Controller to Route
      //   newPath = origPath.replace(/controllers/g, "routes");
      // }
      if(toType === 2){
        //Controller to Template
        newPath = origPath.replace(/controllers/g, "templates").replace(/.js/g, ".hbs");
      }
    }
    if (fromType === 1){
      if (toType === 2) {
        newPath = origPath.replace(/routes/g, "templates").replace(/.js/g, ".hbs");
      }else if(toType === 0){
        newPath = origPath.replace(/routes/g, "controllers");
      }
    }
    if (fromType === 2){
      if (toType === 0) {
        newPath = origPath.replace(/templates/g, "controllers").replace(/.hbs/g, ".js");
      }
      // else if(toType === 1){
      //   newPath = origPath.replace(/templates/g, "routes");
      // }
    }
    if (fromType === 3){
      if (toType === 4) {
        newPath = origPath.replace(/component.js/g, "template.hbs");
      }
    }
    if (fromType === 4){
      if (toType === 3) {
        newPath = origPath.replace(/template.hbs/g, "component.js");
      }
    }
    return newPath || false;
  }

  toggledFilePath(){
    console.log('toggledFilePath');
    var series = this.openSeriesForFileType(this.currentFiletype()),
    fileType = this.currentFiletype();
    while (series.length > 0) {
      var path = this.transformPath(fileType, series.shift());
      console.log(path);
      if(path){
        return path;
      }
    }
    return false;
  }

  currentFiletype(){
    if (this._isController()){
      return 0;
    }else if(this._isRoute()){
      return 1;
    }else if(this._isTemplate()){
      return 2;
    }else if(this._isComponent()){
      return 3;
    }else if(this._isComponentTemplate()){
      return 4;
    }else{
      return -1;
    }
  }

  openSeriesForFileType(type){
    switch (type) {
      case 0:
        return [1,2];
      case 1:
        return [2,0];
      case 2:
        return [0,1];
      case 3:
        return [4];
      case 4:
        return [3];
      default:
      return [];
    }
  }

  _openFilePath() {
    return this._currentItem().buffer.file.path;
  }

  _isTemplate() {
    var isA = this._openFilePath().match(/templates/g);
    return isA;
  }
  _isComponentTemplate() {
    var isA = this._openFilePath().match(/(components).*(template.hbs)/g);
    return isA;
  }
  _isRoute() {
    return this._openFilePath().match(/(routes)/g);
  }
  _isController() {
    return this._openFilePath().match(/controllers/g);
  }
  _isComponent() {
    return this._openFilePath().match(/(components).*(component.js)/g);
  }

}
