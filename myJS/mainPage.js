/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// index.html に読み込む
function loadMain(file) {
    $("#main").load(file);
}
// リストの選択項目の文字色を変える
function listActive(tag) {
    $('.listSelect').attr('active', 'false'); // すべて非選択にしておく
    tag.children('.listSelect').attr('active', 'true'); // 子要素にある文字色を変える
}
