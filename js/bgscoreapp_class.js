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
    this.settingwindow = $("#settingwindow");
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
      const topleft = this.winposition(this.settingwindow);
      this.settingwindow.css(topleft);
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

  //画面中央に表示するための左上座標を計算
  winposition(winobj) {
    const p_width = $("#mainwindow").width();
    const p_height = $("#mainwindow").height();
    const wx = (p_width - winobj.outerWidth(true)) / 2;
    const wy = (p_height - winobj.outerHeight(true)) / 2;
    return {left:wx, top:wy};

/********************
console.log("winposition", $(document).scrollLeft(), $(document).scrollTop(), $(window).width() , winobj.outerWidth(), $(window).height() , winobj.outerHeight());
console.log("winposition", $(document).scrollLeft(), $(document).scrollTop(), $(window).width() , winobj.width(), $(window).height() , winobj.height());
    let wx = $(document).scrollLeft() + ($(window).width() - winobj.outerWidth()) / 2;
    if (wx < 0) { wx = 0; }
    let wy = $(document).scrollTop() + ($(window).height() - winobj.outerHeight()) / 2;
    if (wy < 0) { wy = 0; }
    return {top:wy, left:wx};
******************/
  }

}
