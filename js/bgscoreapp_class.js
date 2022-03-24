// bgscoreapp_class.js
"use strict";

class BgScoreApp {
  constructor() {
    this.resetScore();
    this.setDomNames();
    this.setEventHandler();
    this.settingVars = {}; //設定内容を保持するオブジェクト
  }

  setDomNames() {
    this.mainwin = $("#mainwindow");
    this.setting = $("#settingwindow");
    this.applybtn = $("#applybtn");
    this.cancelbtn = $("#cancelbtn");
    this.settingbtn = $("#settingbtn, #matchinfo"); //ポイント表示部分も設定ボタンとして機能させる
    this.scorecard = $("#score1, #score2");
    this.cardall = $(".card");
  }

  setEventHandler() {
    //設定画面の[RESET SCORE]ボタンがクリックされたとき
    this.applybtn.on("click", () => {
      this.resetScore();
      this.saveSettingVars(); //変更後の値を有効にする
      this.cancelbtn.trigger("click");
    });

    //設定画面の[CANCEL]ボタンがクリックされたとき
    this.cancelbtn.on("click", () => {
      this.mainwin.show();
      this.cardall.removeClass("flipup90 flipdn90 flipup0 flipdn0"); //タップ連打でバグった時に解除する
      this.setting.removeClass("fliphoriz0").on("transitionend",  () => {
        this.mainwin.removeClass("fliphoriz90");
        this.setting.off("transitionend").hide();
        this.loadSettingVars(); //transitionが終わってから書き戻す
      });
    });

    //メイン画面の[SETTINGS]ボタンがクリックされたとき
    this.settingbtn.on("click", () => {
      this.setting.show();
      this.mainwin.addClass("fliphoriz90").on("transitionend",  () => {
        this.setting.addClass("fliphoriz0");
        this.mainwin.off("transitionend").hide();
        this.saveSettingVars(); //元の値を覚えておく
      });
    });

    //スコアカードがスワイプあるいはタップされたとき→1枚めくる
    this.scorecard.on("swiperight swipeleft tap", (e) => {
      const player = parseInt($(e.currentTarget).attr("id").slice(-1));
      if (e.type == "swiperight" || e.type == "tap") {
        const opt = {delta: +1, transform_n: "next", transition_c: "flipup90", transition_n: "flipup0"};
        this.flipCard(player, opt);
      } else if (e.type == "swipeleft") {
        const opt = {delta: -1, transform_n: "prev", transition_c: "flipdn90", transition_n: "flipdn0"};
        this.flipCard(player, opt);
      }
    });
  }

  //カードをめくる
  flipCard(player, opt) {
    const cardcurr = $("#score" + player + "curr");
    const cardnext = $("#score" + player + "next");

    const scrcurr = this.score[player];
    const scrnext = this.calcNextScore(scrcurr, opt.delta);
    this.score[player] = scrnext;

    if (scrcurr == scrnext) { return; }

    cardnext.text(scrnext).show().addClass(opt.transform_n);
    cardcurr.addClass(opt.transition_c).on("transitionend",  () => {
      cardcurr.off("transitionend");
      cardnext.addClass(opt.transition_n).on("transitionend",  () => {
        cardnext.off("transitionend").hide().removeClass(opt.transition_n).removeClass(opt.transform_n);
        cardcurr.text(scrnext).removeClass(opt.transition_c);
        this.checkCrawford(player);
      });
    });
  }

  //次カードのスコアを計算
  calcNextScore(sc, delta) {
    let nx = sc + delta;
    if (nx > this.matchlen) { nx = this.matchlen; }
    if (nx < 0) { nx = 0; }
    return nx;
  }

  //Crawfordかどうかを判断
  checkCrawford(player) {
    let cfstr;
    if (this.score[1] == this.matchlen || this.score[2] == this.matchlen) {
      cfstr = "MATCH";
    } else if (this.score[1] == this.score[2] && this.matchlen - this.score[player] == 1) {
      cfstr = "DMP";
    } else if (this.matchlen - this.score[player] == 1 && this.crawford == 0) {
      this.crawford = 1; this.cfplayer = player;
      cfstr = "Crawford";
    } else if (this.matchlen - this.score[this.cfplayer] == 1) {
      this.crawford = 0;
      cfstr = "Post<br>Crawford";
    } else {
      this.crawford = 0; this.cfplayer = 0;
      cfstr = "";
    }
    $("#crawfordinfo").html(cfstr);
  }

  //設定画面でapplyした際に初期設定に戻す
  resetScore() {
    this.score = [0, 0, 0];
    this.crawford = 0;
    this.cfplayer = 0;
    this.matchlen = parseInt( $("#matchlength").val() );
    const matchinfo = $("#matchlength option:selected").text();
    $("#matchinfo").text(matchinfo);
    $("#crawfordinfo").text("");
    $("#score1curr,#score1next").text(this.score[1]);
    $("#score2curr,#score2next").text(this.score[2]);
  }

  saveSettingVars() {
    this.settingVars.matchlen = $("#matchlength").val();
  }

  loadSettingVars() {
    $("#matchlength").val(this.settingVars.matchlen);
  }

}
