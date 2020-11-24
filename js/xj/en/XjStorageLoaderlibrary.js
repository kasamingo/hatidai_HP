//========================================================
//
// ■XJStorageLoaderクラス定義
//
//========================================================

(function() {

	/*========================================================
	 コンストラクタ
	========================================================*/
	XjStorageLoaderLibraryKessanEn = function(s)
	{
		var defaults = {
			domain:'//www.xj-storage.jp',
			company:'AS02693',
			documents_results:'201',
			documents_presen:'202',
			documents_secrity:'203,204',
			//documents_report:'96,101,102,103,104',
			documents_meeting:'205,206,207',
			documents_other:'208',
			documents_disclosure:'15,209',

			display_id_results:'xj-mainlist-results_en',
			display_id_presen:'xj-mainlist-presen_en',
			display_id_secrity:'xj-mainlist-secrity_en',
			//display_id_report:'xj-mainlist-report',
			display_id_meeting:'xj-mainlist-meeting_en',
			display_id_other:'xj-mainlist-other_en',
			display_id_disclosure:'xj-mainlist-disclosure_en'
		};

		this.settings = $.extend(defaults, s);
		this.xjlist_results = [];
		this.xjlist_presen = [];
		this.xjlist_secrity = [];
		//this.xjlist_report = [];
		this.xjlist_meeting = [];
		this.xjlist_other = [];
		this.xjlist_disclosure = [];

		//this.fdate;
		//this.pdate;
		//this.documents;

		//initメソッド実行
		XjStorageLoaderLibraryKessanEn.prototype.init.call(this);
 	};

	/*========================================================
	 初期設定
	========================================================*/
	XjStorageLoaderLibraryKessanEn.prototype.init = function()
	{

		$.ajaxSetup({scriptCharset:'utf-8'});

		var self = this;

		var xjurl ;

		this.xjlist_results.length = 0;
		xjurl = this.createUrl ( self.settings.documents_results ) ;
		this.prepareList ( self.xjlist_results, xjurl,
				self.settings.display_id_results ) ;

		this.xjlist_presen.length = 0;
		xjurl = this.createUrl ( self.settings.documents_presen ) ;
		this.prepareList ( self.xjlist_presen, xjurl,
				self.settings.display_id_presen ) ;

		this.xjlist_secrity.length = 0 ;
		xjurl = this.createUrl ( self.settings.documents_secrity ) ;
		this.prepareList ( self.xjlist_secrity, xjurl,
				self.settings.display_id_secrity ) ;

		/*this.xjlist_report.length = 0 ;
		xjurl = this.createUrl ( self.settings.documents_report ) ;
		this.prepareList ( self.xjlist_report, xjurl,
				self.settings.display_id_report ) ;*/

		this.xjlist_meeting.length = 0 ;
		xjurl = this.createUrl ( self.settings.documents_meeting ) ;
		this.prepareList ( self.xjlist_meeting, xjurl,
				self.settings.display_id_meeting ) ;

		this.xjlist_other.length = 0 ;
		xjurl = this.createUrl ( self.settings.documents_other ) ;
		this.prepareList ( self.xjlist_other, xjurl,
				self.settings.display_id_other ) ;


		this.xjlist_disclosure.length = 0;
		xjurl = this.createUrl ( self.settings.documents_disclosure ) ;
		this.prepareList ( self.xjlist_disclosure, xjurl, self.settings.display_id_disclosure ) ;

		//this.show();
	};

	/*========================================================
	 情報取得用URL生成
	========================================================*/
	XjStorageLoaderLibraryKessanEn.prototype.createUrl = function ( code )
	{
		var self = this;
		var xjurl;

		xjurl = self.settings.domain + '/public-list/GetList.aspx?company=';
		xjurl+= self.settings.company;

		if(self.settings.len && self.settings.len > 0){
			xjurl+= '&len=' + self.settings.len;
		}
		else {
			xjurl+= '&len=10000';
		}

		if (code && code.length > 0) {
			xjurl+= '&doctype=' + code;
		}

		xjurl+= '&filetype=PDF-GENERAL';
		xjurl+= '&output=json&callback=?';

		//clipboardData.setData('text',xjurl);

		return xjurl;
	}




	/*============================================
	 空白除去
	============================================*/
	XjStorageLoaderLibraryKessanEn.prototype.spaceTrim = function(str) {
		return str.replace(/[ 　\t\r\n]+/g, "");
	}

	/*============================================
	 全角英数を半角に変換
	============================================*/
	XjStorageLoaderLibraryKessanEn.prototype.zen2han = function(str){
		return str.replace(/[０-ｚ]/g,function($0){
			return String.fromCharCode(parseInt($0.charCodeAt(0))-65248);
		});
	}



	/*========================================================
	 年度振り分け情報込みの情報格納
	========================================================*/
	XjStorageLoaderLibraryKessanEn.prototype.prepareList = function(xjlist, xjurl, display_id)
	{
		var self = this;

		$.ajax({
			url: xjurl,
			dataType: 'json',

			success : function(data, dataType){

				if ( undefined == data.items )
				{
					return ;
				}

				$.each(data.items, function(i,item)
				{
					var onelist = {};

					// ファイル関連のプロパティ生成
					if (item.files)
					{
						$.each(item.files, function(j,file) {
							if ( file.type == 'PDF-GENERAL')
							{
								onelist.url = file.url;
								onelist.size = parseInt(file.size);
								onelist.page = file.page	;
							}
						});
					}

					if ( !onelist.url )
					{
						onelist.url = '' ;
					}

					if ( !onelist.size )
					{
						onelist.size = 0 ;
					}

					if ( !onelist.page )
					{
						onelist.page = 0 ;
					}


					//ファイルサイズの生成
					if (onelist.size > 0)
					{
						if (onelist.size > 1000000)
						{
							onelist.size = parseInt(onelist.size/1000000) + 'M';
						}
						else if (onelist.size > 1000)
						{
							onelist.size = parseInt(onelist.size/1000) + 'K';
						}
					}
					else
					{
						onelist.size = '－';
					}

					//ページ数の生成
					if (onelist.page > 0)
					{
						onelist.page = onelist.page ;
					}
					else
					{
						onelist.page = '－' ;
					}

					//タイトル文
					onelist.title = item.title;

					// 日付関連
					onelist.date = item.publishDate.split(' ')[0].split('/');
					onelist.date_format = onelist.date[1] + '/' + onelist.date[2] + '/'
							+ onelist.date[0] ;

					//XJ-Storageリストに格納
					xjlist.push(onelist);
				});
			},
			complete : function(XMLHttpRequest, textStatus)
			{
				self.show(xjlist, display_id);
			}
		});
	}


	/*========================================================
	 表示処理
	========================================================*/
	XjStorageLoaderLibraryKessanEn.prototype.show = function(xjlist, display_id)
	{
		var self = this;
		var cont = '';

		/*メイン出力内容
		-----------------------------------------------*/

		$('#' + display_id).empty();

		cont += '' ;

		for ( var i = 0; i < xjlist.length; i++ )
		{

			//最新4件ずつ表示
			if ( 3 < i )
			{
				break ;
			}

			var xj_data = xjlist[ i ] ;


  		cont += '<dl class="pdf" style="position: relative;">' ;
			cont += '<dt>' + xj_data.date_format + '</dt>' ;

			if ( xj_data.size != '－' )
			{
				cont += '<dd class="txt">' ;
			}
			else{
				cont += '<dd class="txt nonpdf">' ;
			}

			if ( xj_data.url != '' )
			{
				cont += '<a href="' + xj_data.url + '" target="_blank">';
			}

			cont += xj_data.title ;

			if ( xj_data.url != '' )
			{
				cont += '</a>' ;
			}

			cont += '</dd>' ;


			if ( xj_data.url != '' && xj_data.size != '－' )
			{

				cont += '<a href="' + xj_data.url + '" target="_blank" class="pdf_link">' ;
				cont += '<span>（' + xj_data.size + 'B）</span>' ;
				cont += '</a>' ;
			}

  		cont += '</dl>' ;

		}

		if ( cont == '' )
		{
			cont += '<dl><dd class="nolist">There is no document.</dd></dl>' ;
		}



		$( '#' + display_id ).html ( cont ) ;
	}

}());
