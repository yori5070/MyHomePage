/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class mkList {
    public list:string; // 主要な変数
    public activeFile: string; // アクティブファイル名
    // パネルグループの囲み
    public listGroup: string =`<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                                    %secBlock
                                </div>`;
    // パネル（セクション）
    public panelSect: string =`<div class="panel panel-default">
                                    <div class="panel-heading" role="tab" id="heading%listNum">
                                        <h4 class="panel-title">
                                           <div role="button" data-toggle="collapse" data-parent="#accordion"
                                            href="#collapse%listNum" aria-expanded="%aria-ex_BOOLEAN" aria-controls="collapse%listNum"
                                            onclick="listActive($(this)); loadMain('%mainSecFile');">
                                                <div class="listSelect" active="%ACTIVE">%secTitle</div>
                                            </div>
                                        </h4>
                                    </div>
                                    <div id="collapse%listNum" class="panel-collapse %collapse_IN" role="tabpanel" aria-labelledby="heading%listNum">
                                        %contBlock
                                    </div>
                                </div>\n`;
    // コンテンツ                                
    public panelCont: string =`<div class="panel-body" onclick="listActive($(this)); loadMain('%mainFile');">
                                    <div class="listSelect" active="false">%contTitle</div>
                                </div>\n`;
    // コンテンツブロック要素を作る                               
    public mkCont(title: string, file: string):string {
        return this.panelCont.replace('%contTitle', title).replace('%mainFile', file);
    }
    // コンテンツをパネルにまとめる
    public mkSect(title: string, num: string, block: string, file: string): string {
        var oSect: number = 1; // 最初に開いておくセクション（一つ）
        if (+num == oSect) {
            this.activeFile = file;
            return this.panelSect.replace('%secTitle', title)
                .replace(/%listNum/g, num)
                .replace('%contBlock', block)
                .replace('%mainSecFile', file)
                .replace('%aria-ex_BOOLEAN','true')
                .replace('%collapse_IN','collapse in')
                .replace('%ACTIVE','true');
        } else{
            return this.panelSect.replace('%secTitle', title)
                .replace(/%listNum/g, num)
                .replace('%contBlock', block)
                .replace('%mainSecFile', file)
                .replace('%aria-ex_BOOLEAN','false')
                .replace('%collapse_IN','collapse')
                .replace('%ACTIVE','false');    
        }
    }
    // 数値を３桁にする
    public formatNum(num: number):string {
        return ('000' + num.toString()).slice(-3);
    }
    // メイン画面に呼び出すファイル
    public mainFile(dir: string, file: string): string {
        return './main/Dir/File.html'.replace('Dir', dir).replace('File',file);
    }
    // 初期化
    constructor(private jsonData:any) {
        var secBlock: string = ""; // 初期化（セクションを空に）
        var nList: number = jsonData.length; // セクションの数
        /* セクションごとの処理 */
        for(var i=0; i< nList; i++){
            var listNum: string = this.formatNum(i + 1); // セクションの番号
            var secTitle: string = jsonData[i].section // セクションの名称
            var sDir: string; // 格納するディレクトリ
            var sFile: string; // セクションを説明するファイル
            /* 格納するディレクトリを指定する */
            if ("secDir" in jsonData[i]) { // ディレクトリ名が指定されてた時
                sDir = jsonData[i].secDir;
            } else { // 指定されていない時は自動的に割りつける
                sDir = listNum; // セクション番号
            }
            /* セクションを説明するファイルを指定 */
            if ("secFile" in jsonData[i]) { // ファイル名が指定されてた時
                sFile = this.mainFile(sDir, jsonData[i].secFile);
            } else { // 指定されていない時はファイル名は '000'
                sFile = this.mainFile(sDir, '000');
            }

            /* コンテンツブロックを作成 */            
            var contBlock: string =""; // 初期化（コンテンツブロックを空に）
            var dataArr: any = jsonData[i].data; // コンテンツの配列
            var nCont: number = dataArr.length; // コンテンツの数
            /* コンテンツごとの処理 */
            for(var j=0; j< nCont; j++){
                var contTitle: string = dataArr[j].name; // コンテンツのタイトル
                var mFile: string; // 呼び出すmainファイル
                if ("contFile" in dataArr[j]) { // ファイル名が指定されてた時
                    mFile = this.mainFile(sDir, dataArr[j].contFile);
                } else { // 指定されていない時
                    mFile = this.mainFile(sDir, this.formatNum(j + 1));
                }
                contBlock += this.mkCont(contTitle,mFile); // コンテンツブロックに追加
            }
            secBlock += this.mkSect(secTitle, listNum, contBlock, sFile); // セクションブロックに追加
        }
        /* リストのHTMLとして保存する */
        this.list = this.listGroup.replace('%secBlock',secBlock);  
    }
    // リストのHTMLを返す
    public getPanel():string {
        return this.list;
    }
    public getActFile(): string {
        return this.activeFile;
    }
}
// index.htmlに追加する 表示するメインファイル名を返す
function mkAcoList(listData: any): string {
    var listCode = new mkList(listData);
    $("#selList").append(listCode.getPanel());
    return listCode.getActFile();
}