require 'json'

#
# 各種のイメージのHtmlを作るクラス
#
module MkImg
  # アイコンのテンプレート
  TempIcon = "<img src='./myIMG/LibreCAD/icons/%ICON%' name='%NAME%' class='%CLASS%'/>"
  # キーのテンプレート
  TempKey = "<span class='keyBorder'>%KEY_NAME%</span>"
  # 操作例画像のテンプレート
  TempImg = "<img src='./myIMG/LibreCAD/window/%IMG%' name='%NAME%' class='cadImg'/>"
  
  # ドックアイコン
  def docIcon(iconArr)
    TempIcon.gsub("%ICON%",iconArr[0]).gsub("%NAME%",iconArr[1]).gsub("%CLASS%","iconDoc")
  end
  # ドックアイコン（文中で使う）
  def docIconMin(iconArr)
    TempIcon.gsub("%ICON%",iconArr[0]).gsub("%NAME%",iconArr[1]).gsub("%CLASS%","iconDocMin")
  end
  # メニューアイコン
  def menuIcon(iconArr)
    TempIcon.gsub("%ICON%",iconArr[0]).gsub("%NAME%",iconArr[1]).gsub("%CLASS%","iconMenu")
  end
  # Escキー
  def escKey
    TempKey.gsub("%KEY_NAME%","Esc")
  end
  # Spaceキー
  def spKey
    TempKey.gsub("%KEY_NAME%","Space")
  end
  # CRキー
  def crKey
    TempKey.gsub("%KEY_NAME%","&#x23CE;")
  end
  # 操作例画像
  def operImg(imgArr)
    TempImg.gsub("%IMG%",imgArr[0]).gsub("%NAME%",imgArr[1])
  end
  
#  module_function :docIcon
#  module_function :menuIcon
#  module_function :escKey
#  module_function :spKey
#  module_function :operImg
end

#
# サブセクションで使う各項目のHtmlを作るクラス
#
module MkSubSecMod
  # タイトルのテンプレート
  TempTitle = "<div class='titleTool'>\n<p>%TITLE%</p>\n</div>\n"
  # 解説のテンプレート
  TempComment = "<div class='commTool'>%COMMENT%</div>\n"
  # ツール選択のテンプレート
  TempSelcTool = "<div class='callTool'>\n<table width='100%'>%TOOLHEAD%%TOOLBODY%</table>\n</div>\n"
  TempSelcToolHead = "<thead>\n<tr>\n<th>アイコン</th>\n<th colspan='2'>ドックウィジット以外の選択</th>\n</tr>\n</thead>\n"
  TempSelcToolBody = "<tbody>\n<tr>%TOOL_DOC%%TOOL_BAR%</tr>\n<tr>%TOOL_MENU%</tr>\n<tr>%TOOL_CMD%</tr>\n</tbody>\n"
  TempSelcToolBodyDoc = "<td class='callDocIcon bBorder' rowspan='3'>%DOC_ICON%</td>\n"
  TempSelcToolBodyBar = "<td class='otherOper'>ツールバー：</td>\n<td><h4>%OPER_BAR%</h4></td>\n"
  TempSelcToolBodyMenu = "<td>メニュー：</td>\n<td><h4>%OPER_MENU%</h4></td>\n"
  TempSelcToolBodyCmd = "<td class='bBorder'>コマンド：</td>\n<td class='bBorder'><h4>%OPER_CMD%</h4></td>\n"
  # 操作例のテンプレート
  TempOperat = "<div class='container-fluid'>\n<div class='row'>\n<div class='col-md-6'>\n<div class='operTool'>%OPERAT_01%</div></div>" + \
    "<div class='col-md-6'>\n<div class='operTool'>%OPERAT_02%</div>\n</div>\n</div>\n</div>\n" 
  TempOpTitle = "<div class='operTitle'>\n%OP_TITLE%\n</div>\n"
  TempOpComm = "<ol>%OP_COMM%</ol>\n"
  TempOpImg = "<div class='operImg'>\n%OP_IMG%\n</div>\n"
  
  # タイトルの整形
  def title(titleName)
    TempTitle.gsub("%TITLE%",titleName)
  end
  # 解説の整形
  def comment(commArr)
    comment = ''
    for i in 0..commArr.length-1 do
      comment += '<p>'+commArr[i]+'</p>'
    end
    TempComment.gsub("%COMMENT%",comment)
  end
  # ツール選択の整形
  def selctTool(tool_icon, doc_icon, selcArr)
    # ボディ部の置換
    body = TempSelcToolBody\
      .gsub("%TOOL_DOC%",TempSelcToolBodyDoc.gsub("%DOC_ICON%",docIcon(doc_icon)))\
      .gsub("%TOOL_BAR%",TempSelcToolBodyBar.gsub("%OPER_BAR%",selcArr[0]))\
      .gsub("%TOOL_MENU%",TempSelcToolBodyMenu.gsub("%OPER_MENU%",selcArr[1]))\
      .gsub("%TOOL_CMD%",TempSelcToolBodyCmd.gsub("%OPER_CMD%",selcArr[2]))\
      .gsub("%BAR_MenuICON%",menuIcon(tool_icon))\
      .gsub("%DOC_MenuICON%",menuIcon(doc_icon))
    # ツール選択部の置換・完成
    TempSelcTool.gsub("%TOOLHEAD%", TempSelcToolHead).gsub("%TOOLBODY%",body) # ヘッダー部、ボディ部を置換して返す
  end
  # 操作例の整形
  def numExOp(opArr)
    # 操作手順をまとめる
    comment = ""
    for n in 0..opArr["operstep"].length-1 do
      comment += "<li>" + opArr["operstep"][n] + "</li>"
    end
    # 操作例をまとめる
    TempOpTitle.gsub('%OP_TITLE%',opArr['title'])\
      + TempOpComm.gsub("%OP_COMM%",comment)\
      + TempOpImg.gsub("%OP_IMG%",operImg(opArr["img"]))
  end

  def exOperat(tool_icon, doc_icon, dataArr)
    # 操作例のブロックを作る
    TempOperat.gsub("%OPERAT_01%",numExOp(dataArr[0])).gsub("%OPERAT_02%",numExOp(dataArr[1]))\
      .gsub("%BAR_MenuICON%",menuIcon(tool_icon))\
      .gsub("%DOC_ICON_MIN%",docIconMin(doc_icon))\
      .gsub("%SP_KEY%",spKey).gsub("%ESC_KEY%",escKey).gsub("%CR_KEY%",crKey)
  end
  
#  module_function :title
#  module_function :comment
#  module_function :selctTool
#  module_function :exOperat
#  module_function :numExOp
end
#
# サブセクションのHtmlを作成する
#
class MkSubSec
  include MkImg
  include MkSubSecMod
  
  # 初期化　toolアイコンを変数に格納する
  def initialize(tool_icon)
    @t_icon = tool_icon
  end
  # サブセクションをまとめる
  def rdSubSec(dataArr)
    title(dataArr["title"])\
      + comment(dataArr["comment"])\
      + selctTool(@t_icon, dataArr['docIcon'], dataArr['selOther'])\
      + exOperat(@t_icon, dataArr['docIcon'], dataArr['oper'])
  end
end

#
# ruby json2html ファイル名（拡張子はなし）
#
SectBox = "<div class='sectBox'>\n<span class='numSect'>%SEC_NUM%</span><p class='sectTitle'>%SEC_TITLE%</p>%SEC_HTML%\n</div>\n"
#
# JSONファイルを読み込む
#
File.open(ARGV[0]+'.json') do |file|
  secData = JSON.load(file)
  subsec = MkSubSec.new(secData['toolIcon'])
  secHtml = ""
  for n in 0..secData['data'].length-1 do
    secHtml += subsec.rdSubSec(secData['data'][n])
  end
  #
  # HTMLをファイルに書き込む
  #
  File.open(ARGV[0]+'.html', 'w') do |of|
    of.puts(SectBox.gsub("%SEC_NUM%",secData['secNumber']).gsub("%SEC_TITLE%",secData['secTitle']).gsub("%SEC_HTML%",secHtml))
  end
end