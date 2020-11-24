//========================================================
//
// ■XJStorageLoaderクラス定義
//
//========================================================

if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(elt /*, from*/)
	{
		var len = this.length;

		var from = Number(arguments[1]) || 0;
		from = (from < 0)
				 ? Math.ceil(from)
				 : Math.floor(from);
		if (from < 0)
			from += len;

		for (; from < len; from++)
		{
			if (from in this &&
					this[from] === elt)
				return from;
		}
		return -1;
	};
}

(function() {

	/*========================================================
	 コンストラクタ
	========================================================*/
	XjStorageLoaderNewsEn = function(s)
	{
		var defaults =
		{
			domain:'//www.xj-storage.jp',
			company:'AS02693',
			pdf:'1',
			len: '10000',
			documents_all:'',
			documents_meeting:'205',
			//documents_Other:'206',
			documents_ketugi:'207'
		};

		this.settings = $.extend ( defaults, s ) ;
		this.fdate;
		this.pdate;
		this.documents;
		this.select_latest = '';
		this.select_oldest = '';

		this.ary_doc_no ;
		this.ary_doc_meeting ;
		//this.ary_doc_Other ;
		this.ary_doc_ketugi ;

		XjStorageLoaderNewsEn.prototype.init.call(this);
 	};

	/*========================================================
	 初期設定
	========================================================*/
	XjStorageLoaderNewsEn.prototype.init = function()
	{
		$.ajaxSetup ( { scriptCharset:'utf-8' } ) ;

		//$.ajaxSetup({scriptCharset:'shift_jis'});

		this.ary_doc_meeting  = this.settings.documents_meeting.split ( "," ) ;
		//this.ary_doc_Other	= this.settings.documents_Other.split ( "," ) ;
		this.ary_doc_ketugi	= this.settings.documents_ketugi.split ( "," ) ;
		this.settings.documents_all = this.settings.documents_meeting + ',' + this.settings.documents_ketugi ;
				//this.settings.documents_Other ;

		//初期読み込み対象指定
		this.documents = this.settings.documents_all;
		this.ary_doc_no = this.documents.split ( "," ) ;

		//記事年範囲取得
		this.setMaxMinYear ( this.documents ) ;
	};

	/*========================================================
	 年選択ボタン生成
	========================================================*/
	XjStorageLoaderNewsEn.prototype.setMaxMinYear = function(code)
	{
		var self = this;
		var xjurl = '';

		//URL生成
		xjurl += self.settings.domain + '/public-list/GetList.aspx?company=';
		xjurl += self.settings.company;
		xjurl += '&len=10000';

		// タイプ指定
		if ( this.documents && this.documents.length > 0 )
		{
			xjurl += '&doctype=' + this.documents;
		}

		xjurl += '&output=json&callback=?';

		$.ajax (
		{
			url: xjurl,
			dataType: 'json',

			success : function ( data )
			{
				if ( undefined == data.items )
				{
					return ;
				}

				$.each ( data.items, function ( i, item )
				{
					// 目的の文書番号でなかったら
					if ( -1 == self.ary_doc_no.indexOf ( item.disclosureCode ) )
					{
						return true;
					}

					// 年度の算出
					entry_year = self.getFiscalYear ( item.title ) ;

					// 第○期が無かったら
					if ( '' == entry_year )
					{
						var date = item.publishDate.split(' ')[0].split('/');
						if ( 4 <= Number ( date[ 1 ] ) )
						  {
							  entry_year = Number ( date[ 0 ] ) ;
						  }
						  else
						  {
							  entry_year = Number ( date[ 0 ] )- 1 ;
						  }
					}

					//最新の年月期と最古の年月期を取得
					if ( self.select_latest === '' || self.select_latest < entry_year )
					{
						self.select_latest = entry_year ;
					}

					if ( self.select_oldest === '' || self.select_latest >= entry_year )
					{
						self.select_oldest = entry_year ;
					}
				});

				//self.active_select = self.select_latest ;
			},
			complete : function()
			{
				self.setDateButton ( ) ;
				self.show ( ) ;
			}
		}
		);
	}

	/*========================================================
	 第XX期を読み取り→20XX年Y月期
	========================================================*/
	XjStorageLoaderNewsEn.prototype.getFiscalYear = function ( title )
	{
		var self = this;
		var fiscalyear = '' ;
		var res;

		//スペース削除
		title = self.spaceTrim ( title ) ;

		//判定パターン
		var regexp1 = /第([0-9０-９]{1,2})期/;
		var regexp2 = /第([0-9０-９]{1,2})回/;


		if ( ( res = regexp1.exec ( title ) ) !== null )
		{
			fiscalyear = Number ( self.zen2han ( res[ 1 ] ) ) ;
			fiscalyear = 2005 + fiscalyear ;
		}
		else if ( ( res = regexp2.exec ( title ) ) !== null )
		{
			fiscalyear = Number ( self.zen2han ( res[ 1 ] ) ) ;
			fiscalyear = 2005 + fiscalyear ;
		}

		return fiscalyear ;

	}

	/*============================================
	 空白除去
	============================================*/
	XjStorageLoaderNewsEn.prototype.spaceTrim = function(str) {
		return str.replace(/[ 　\t\r\n]+/g, "");
	}

	/*============================================
	 全角英数を半角に変換
	============================================*/
	XjStorageLoaderNewsEn.prototype.zen2han = function(str){
		return str.replace(/[０-ｚ]/g,function($0){
			return String.fromCharCode(parseInt($0.charCodeAt(0))-65248);
		});
	}

	/*============================================
	 平成を西暦に変換
	============================================*/
	XjStorageLoaderNewsEn.prototype.heiseiToSeireki = function ( y )
	{
		if ( ( y > 0 ) && ( y < 99 ) )
		{
			 return ( 1988 + y ) ;
		}
	}

	/*============================================
	 西暦を平成に変換
	============================================*/
	XjStorageLoaderNewsEn.prototype.SeirekiToHeisei = function ( y )
	{
		if ( y > 1988 )
		{
			return ( y - 1988 ) ;
		}

		return y ;
	}

	/*========================================================
	 年選択ボタン生成
	========================================================*/
	XjStorageLoaderNewsEn.prototype.setDateButton = function ( )
	{
		var self = this ;
		self.active_select = self.select_latest;
		var ul = $( '#xj-select-year_set_en' ) ;

		//年範囲分年メニュー生成
        for (var i = self.select_latest; i >= self.select_oldest; i--) {

            tmp = $('<div data-year="' + i + '">FY' + i + '</div>');//文字列調整201807@藤原

            ul.append(tmp);
        }
        
        $('#xj-select-year_set_en div:first').addClass('selected');

        ul.find('div').click(function () {
            /*表示修正201807@藤原========================*/
            
            $('#xj-mainlist_en').attr('data-page', 1);
            
            $('#xj-select-year_s_en').find('div').removeClass('selected')
            $(this).addClass('selected');
            var year = $(this).attr('data-year');

            $('#xj-select-year_s_en').attr('data-year', year);

            if ("" == year) {
                self.fdate = "";
                self.pdate = "";
                self.setDuration(year, year);
                return;
            }

            self.setDuration(year, year);
            
            /*========================表示修正201807@藤原*/
        });
		self.setDuration(self.active_select);
	}

	/*========================================================
	 絞込み期間更新
	========================================================*/
	XjStorageLoaderNewsEn.prototype.setDuration = function ( f, p )
	{
		this.fdate = f;
		this.pdate = p;
		this.show();
	}

	/*========================================================
	 絞込みカテゴリー更新
	========================================================*/
	XjStorageLoaderNewsEn.prototype.setDocument = function ( d )
	{
		this.documents = d;
		this.show();
	}

	/*========================================================
	 表示処理
	========================================================*/
	XjStorageLoaderNewsEn.prototype.show = function()
	{
		var self = this;
		var is_first = true;

		var url =  this.settings.domain + '/public-list/GetList.aspx?company=';

		url += this.settings.company;

		// タイプ指定
		if ( this.documents && this.documents.length > 0 )
		{
			url+= '&doctype=' + this.documents;
		}

		//url+= '&filetype=PDF-GENERAL';
		url+= '&output=json&callback=?';

		$.getJSON ( url, function ( data )
		{
			$('#xj-mainlist-meeting_en').empty ( ) ;
			//$('#xj-mainlist-other').empty ( ) ;
			$('#xj-mainlist-ketugi_en').empty ( ) ;

			var cont_meeting = '';
			var cont_other = '';
			var cont_ketugi = '';

			if ( data.items )
			{
				var j1 = 0 ;
				//var j2 = 0 ;
				var j3 = 0 ;
				var now_dd = new Date ( ) ;

				$.each ( data.items, function ( i, item )
				{
					var cont = '';

					// 目的の文書番号でなかったら
					if ( -1 == self.ary_doc_no.indexOf ( item.disclosureCode ) )
					{
						return true;
					}

					// 日付設定
					var date = item.publishDate.split(' ')[0].split('/');
					var dateStr = date[1] + '/' + date[2] + '/' + date[0] ;
					var date_dd = new Date ( parseInt ( date[0], 10 ),
							parseInt ( date[1], 10 ) - 1,
							parseInt ( date[2], 10 ) ) ;

					// 年度の算出
					var entry_year = self.getFiscalYear ( item.title ) ;

					if ( "" == entry_year )
					{
						var date = item.publishDate.split(' ')[0].split('/');
						if ( 4 <= Number ( date[ 1 ] ) )
						  {
							  entry_year = Number ( date[ 0 ] );
						  }
						  else
						  {
							  entry_year = Number ( date[ 0 ] ) - 1 ;
						  }

					}
					if ( ( '' == self.fdate || !self.fdate ) )
					{

						if ( -1 != self.ary_doc_meeting.indexOf ( item.disclosureCode ) &&
								j1 < 0 )
						{
							return true ;
						}

						/*if ( -1 != self.ary_doc_Other.indexOf ( item.disclosureCode ) &&
								j2 < 0 )
						{
							return true ;
						}*/
						if ( -1 != self.ary_doc_ketugi.indexOf ( item.disclosureCode ) &&
								j3 < 0 )
						{
							return true ;
						}
					}
					// 対象の年では無かったら
					else if ( self.fdate != entry_year )
					{
						return true ;
					}


					var entrytype = '';
					var url = '';
					var size = '';
					var page = '';

					if ( item.files )
					{
						$.each ( item.files, function ( j, file )
						{
							if ( file.type == 'PDF-GENERAL')
							{
								url = file.url ;
								size = parseInt ( file.size ) ;
								page = file.page ;
							}
						});
					}

					// サイズ設定
					if ( size > 0)
					{
						if ( size > 1000 && size < 1000000 )
						{
							size = parseInt ( size / 1000 ) + 'K' ;
						}
						else if ( size > 1000000 )
						{
							size = parseInt ( size / 1000000 ) + 'M' ;
						}
					}
					else
					{
						size = '－' ;
					}

					//ページ数の生成
					if ( page <= 0 )
					{
						page = '－';
					}

					// 画面表示


					cont += '<dl class="pdf" style="position: relative;">';

					cont += '<dt>' + dateStr + '</dt>' ;

					if ( size != '－' )
					{
						cont += '<dd class="txt">' ;
					}
					else
					{
						cont += '<dd class="txt nonpdf">' ;
					}


					if  ( url != '')
					{
						cont += '<a href="' + url + '" target="_blank">';
					}
					cont += item.title ;

					if ( url != '' )
					{
						cont += '</a>' ;
					}

					cont += '</dd>';


					if ( url != '' && size != '－' )
					{
						cont += '<a href="' + url + '" target="_blank" class="pdf_link">' ;
						cont += '<span>（' + size + 'B）</span></a>' ;
					}

					cont += '</dl>';



					// 有価証券報告書だったら
					if ( -1 != self.ary_doc_meeting.indexOf ( item.disclosureCode ) )
					{
						j1++ ;
						cont_meeting += cont ;
					}

					// その他法定開示資料だったら
					/*else if ( -1 != self.ary_doc_Other.indexOf ( item.disclosureCode ) )
					{
						j2++ ;
						cont_other += cont ;
					}*/

					else
					{
						j3++ ;
						cont_ketugi += cont ;
					}

				});
			}

			if ( '' == cont_meeting)
			{
				cont_meeting += '<dl><dd>There is no document.</dd></dl>' ;
			}

			/*if ( '' == cont_other )
			{
				cont_other += '<dl><dd>ただいま掲載すべき事項はございません。</dd></dl>' ;
			}*/

			if ( '' == cont_ketugi )
			{
				cont_ketugi += '<dl><dd>There is no document.</dd></dl>' ;
			}

			$('#xj-mainlist-meeting_en').append ( cont_meeting ) ;
			//$('#xj-mainlist-other').append ( cont_other ) ;
			$('#xj-mainlist-ketugi_en').append ( cont_ketugi ) ;
		});
	}

}());
