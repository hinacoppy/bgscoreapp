// bgscoreapp_class.js
"use strict";

class BgScoreApp {
  constructor() {
    this.setDomNames();
    this.setEventHandler();
    this.settingVars = {}; //設定内容を保持するオブジェクト
    this.flipcard = new FlipCard();
  }

  setDomNames() {
    this.applybtn = $("#applybtn");
    this.cancelbtn = $("#cancelbtn");
    this.settingbtn = $("#settingbtn, #matchinfo"); //ポイント表示部分も設定ボタンとして機能させる
    this.scorecard = $("#score1, #score2");
  }

  setEventHandler() {
    //設定画面の[RESET SCORE]ボタンがクリックされたとき
    this.applybtn.on("click", () => {
      this.flipcard.resetScore();
      this.flipcard.showMainPanel();
    });

    //設定画面の[CANCEL]ボタンがクリックされたとき
    this.cancelbtn.on("click", () => {
      this.flipcard.showMainPanel();
      this.loadSettingVars(); //transitionが終わってから書き戻す
    });

    //メイン画面の[SETTINGS]ボタンがクリックされたとき
    this.settingbtn.on("click", () => {
      this.flipcard.showSettingPanel();
      this.saveSettingVars(); //元の値を覚えておく
    });

    //スコアカードがスワイプあるいはタップされたとき→1枚めくる
    this.scorecard.on("swiperight swipeleft tap", (evt) => {
      this.flipcard.driveEvent(evt);
    });
  }

  saveSettingVars() {
    this.settingVars.matchlen = $("#matchlength").val();
  }

  loadSettingVars() {
    $("#matchlength").val(this.settingVars.matchlen);
  }

}
