/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mkList = (function () {
    // 初期化
    function mkList(jsonData) {
        this.jsonData = jsonData;
        // パネルグループの囲み
        this.listGroup = "<div class=\"panel-group\" id=\"accordion\" role=\"tablist\" aria-multiselectable=\"true\">\n                                    %secBlock\n                                </div>";
        // パネル（セクション）
        this.panelSect = "<div class=\"panel panel-default\">\n                                    <div class=\"panel-heading\" role=\"tab\" id=\"heading%listNum\">\n                                        <h4 class=\"panel-title\">\n                                           <div role=\"button\" data-toggle=\"collapse\" data-parent=\"#accordion\"\n                                            href=\"#collapse%listNum\" aria-expanded=\"%aria-ex_BOOLEAN\" aria-controls=\"collapse%listNum\"\n                                            onclick=\"listActive($(this)); loadMain('%mainSecFile');\">\n                                                <div class=\"listSelect\" active=\"%ACTIVE\">%secTitle</div>\n                                            </div>\n                                        </h4>\n                                    </div>\n                                    <div id=\"collapse%listNum\" class=\"panel-collapse %collapse_IN\" role=\"tabpanel\" aria-labelledby=\"heading%listNum\">\n                                        %contBlock\n                                    </div>\n                                </div>\n";
        // コンテンツ                                
        this.panelCont = "<div class=\"panel-body\" onclick=\"listActive($(this)); loadMain('%mainFile');\">\n                                    <div class=\"listSelect\" active=\"false\">%contTitle</div>\n                                </div>\n";
        var secBlock = ""; // 初期化（セクションを空に）
        var nList = jsonData.length; // セクションの数
        /* セクションごとの処理 */
        for (var i = 0; i < nList; i++) {
            var listNum = this.formatNum(i + 1); // セクションの番号
            var secTitle = jsonData[i].section; // セクションの名称
            var sDir; // 格納するディレクトリ
            var sFile; // セクションを説明するファイル
            /* 格納するディレクトリを指定する */
            if ("secDir" in jsonData[i]) {
                sDir = jsonData[i].secDir;
            }
            else {
                sDir = listNum; // セクション番号
            }
            /* セクションを説明するファイルを指定 */
            if ("secFile" in jsonData[i]) {
                sFile = this.mainFile(sDir, jsonData[i].secFile);
            }
            else {
                sFile = this.mainFile(sDir, '000');
            }
            /* コンテンツブロックを作成 */
            var contBlock = ""; // 初期化（コンテンツブロックを空に）
            var dataArr = jsonData[i].data; // コンテンツの配列
            var nCont = dataArr.length; // コンテンツの数
            /* コンテンツごとの処理 */
            for (var j = 0; j < nCont; j++) {
                var contTitle = dataArr[j].name; // コンテンツのタイトル
                var mFile; // 呼び出すmainファイル
                if ("contFile" in dataArr[j]) {
                    mFile = this.mainFile(sDir, dataArr[j].contFile);
                }
                else {
                    mFile = this.mainFile(sDir, this.formatNum(j + 1));
                }
                contBlock += this.mkCont(contTitle, mFile); // コンテンツブロックに追加
            }
            secBlock += this.mkSect(secTitle, listNum, contBlock, sFile); // セクションブロックに追加
        }
        /* リストのHTMLとして保存する */
        this.list = this.listGroup.replace('%secBlock', secBlock);
    }
    // コンテンツブロック要素を作る                               
    mkList.prototype.mkCont = function (title, file) {
        return this.panelCont.replace('%contTitle', title).replace('%mainFile', file);
    };
    // コンテンツをパネルにまとめる
    mkList.prototype.mkSect = function (title, num, block, file) {
        var oSect = 1; // 最初に開いておくセクション（一つ）
        if (+num == oSect) {
            this.activeFile = file;
            return this.panelSect.replace('%secTitle', title)
                .replace(/%listNum/g, num)
                .replace('%contBlock', block)
                .replace('%mainSecFile', file)
                .replace('%aria-ex_BOOLEAN', 'true')
                .replace('%collapse_IN', 'collapse in')
                .replace('%ACTIVE', 'true');
        }
        else {
            return this.panelSect.replace('%secTitle', title)
                .replace(/%listNum/g, num)
                .replace('%contBlock', block)
                .replace('%mainSecFile', file)
                .replace('%aria-ex_BOOLEAN', 'false')
                .replace('%collapse_IN', 'collapse')
                .replace('%ACTIVE', 'false');
        }
    };
    // 数値を３桁にする
    mkList.prototype.formatNum = function (num) {
        return ('000' + num.toString()).slice(-3);
    };
    // メイン画面に呼び出すファイル
    mkList.prototype.mainFile = function (dir, file) {
        return './main/Dir/File.html'.replace('Dir', dir).replace('File', file);
    };
    // リストのHTMLを返す
    mkList.prototype.getPanel = function () {
        return this.list;
    };
    mkList.prototype.getActFile = function () {
        return this.activeFile;
    };
    return mkList;
}());
// index.htmlに追加する 表示するメインファイル名を返す
function mkAcoList(listData) {
    var listCode = new mkList(listData);
    $("#selList").append(listCode.getPanel());
    return listCode.getActFile();
}
