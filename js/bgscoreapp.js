// bgscoreapp.js
"use strict";

var score = [0, 0, 0];
var matchlen = 5;
var maxscore = matchlen;
var crawford = 0;
var cfplayer = 0;
const mainwin = $("#mainwindow");
const setting = $("#settingwindow");

$(function () {

  //設定画面の[RESET SCORE]ボタンがクリックされたとき
  $("#applybtn").on("click", () => {
    reset_score();
    $("#cancelbtn").trigger("click");
  });

  //設定画面の[CANCEL]ボタンがクリックされたとき
  $("#cancelbtn").on("click", () => {
    mainwin.show();
    $(".card").removeClass("flipup90 flipdn90 flipup0 flipdn0"); //タップ連打でバグった時に解除する
    setting.removeClass("fliphoriz0").on("transitionend",  () => {
      mainwin.removeClass("fliphoriz90");
      setting.off("transitionend").hide();
    });
  });

  //メイン画面の[SETTINGS]ボタンがクリックされたとき
  $("#settingbtn").on("click", () => {
    setting.show();
    mainwin.addClass("fliphoriz90").on("transitionend",  () => {
      setting.addClass("fliphoriz0");
      mainwin.off("transitionend").hide();
    });
  });

  //スコアカードがスワイプあるいはタップされたとき→1枚めくる
  $("#score1, #score2").on("swiperight swipeleft tap", (e) => {
    const player = parseInt($(e.currentTarget).attr("id").slice(-1));
    if (e.type == "swiperight" || e.type == "tap") {
      const opt = {delta: +1, transform_n: "next", transition_c: "flipup90", transition_n: "flipup0"};
      flipCard(player, opt);
    } else if (e.type == "swipeleft") {
      const opt = {delta: -1, transform_n: "prev", transition_c: "flipdn90", transition_n: "flipdn0"};
      flipCard(player, opt);
    }
  });

});

//カードをめくる
function flipCard(player, opt) {
  const cardcurr = $("#score" + player + "curr");
  const cardnext = $("#score" + player + "next");

  const scrcurr = score[player];
  const scrnext = nextscore(scrcurr, opt.delta);
  score[player] = scrnext;

  if (scrcurr == scrnext) { return; }

  cardnext.text(scrnext).show().addClass(opt.transform_n);
  cardcurr.addClass(opt.transition_c).on("transitionend",  () => {
    cardcurr.off("transitionend");
    cardnext.addClass(opt.transition_n).on("transitionend",  () => {
      cardnext.off("transitionend").hide().removeClass(opt.transition_n).removeClass(opt.transform_n);
      cardcurr.text(scrnext).removeClass(opt.transition_c);
      check_crawford(player);
    });
  });
}

//次カードのスコアを計算
function nextscore(sc, delta) {
  let nx = sc + delta;
  if (nx > maxscore) { nx = maxscore; }
  if (nx < 0) { nx = 0; }
  return nx;
}

//Crawfordかどうかを判断
function check_crawford(player) {
  let cfstr;
  if (matchlen - score[player] == 1 && crawford == 0) {
    crawford = 1; cfplayer = player; cfstr = "Crawford";
  } else if (crawford == 2 || (crawford == 1 && cfplayer != player)) {
    crawford = 2; cfplayer = 0;      cfstr = "Post<br>Crawford";
  } else {
    crawford = 0; cfplayer = 0;      cfstr = "";
  }
  $("#crawfordinfo").html(cfstr);
}

//設定画面でapplyした際に初期設定に戻す
function reset_score() {
  score = [0, 0, 0];
  crawford = 0;
  cfplayer = 0;
  matchlen = parseInt( $("#matchlength").val() );
  maxscore = (matchlen == 0) ? 99 : matchlen;
  const matchinfo = (matchlen == 0) ? "$" : matchlen;
  $("#matchinfo").text(matchinfo);
  $("#crawfordinfo").text("");
  $("#score1curr,#score1next").text(score[1]);
  $("#score2curr,#score2next").text(score[2]);
}
