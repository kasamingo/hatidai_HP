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
	 コンストラクタ AS02693
	========================================================*/
	XjStorageLoaderNews = function(s)
	{
		var defaults =
		{
			domain:'//www.xj-storage.jp',
			company:'AS02693',
			pdf:'1',
			len: '10000',
			documents_all:'',
			documents_Kessan:'90,92,93,95,97,110,113,114,115,116,117,118,119,120'
		};

		this.settings = $.extend ( defaults, s ) ;
		this.fdate;
		this.pdate;
		this.documents;
		this.select_latest = '';
		this.select_oldest = '';

		this.ary_doc_no ;
		this.ary_doc_Kessan ;

		XjStorageLoaderNews.prototype.init.call(this);
 	};

	/*========================================================
	 初期設定
	========================================================*/
	XjStorageLoaderNews.prototype.init = function()
	{
		$.ajaxSetup ( { scriptCharset:'utf-8' } ) ;

		//$.ajaxSetup({scriptCharset:'shift_jis'});

		this.ary_doc_Kessan  = this.settings.documents_Kessan.split ( "," ) ;
		this.settings.documents_all = this.settings.documents_Kessan ;

		//初期読み込み対象指定
		this.documents = this.settings.documents_all;
		this.ary_doc_no = this.documents.split ( "," ) ;

		//記事年範囲取得
		this.setMaxMinYear ( this.documents ) ;
	};

	/*========================================================
	 年選択ボタン生成
	========================================================*/
	XjStorageLoaderNews.prototype.setMaxMinYear = function(code)
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
					var date = item.publishDate.split(' ')[0].split('/');
					var entry_year = Number ( date[ 0 ] ) ;

					
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
				//self.setDocumentButton ( ) ;
				self.show ( ) ;
			}
		}
		);
	}


	/*========================================================
	 年選択ボタン生成
	========================================================*/
	XjStorageLoaderNews.prototype.setDateButton = function ( )
	{
		var self = this ;
		self.active_select = self.select_latest;
		var ul = $( '#xj-select-year_s' ) ;
		
		//年範囲分年メニュー生成
		for ( var i = self.select_latest; i >= self.select_oldest; i-- )
		{

			if ( i !== '' )
			{
				$( '#xj-select-year_s' ).removeClass('none') ;
			}
			
			if ( i == self.active_select )
			{
				var tmp = $( '<option value="' + i + '" selected>' + i + '年</option>' ) ;
			}
			else
			{
				var tmp = $( '<option value="' + i + '">' + i + '年</option>' ) ;
			}
			
			ul.append ( tmp ) ;
		}

		ul.change ( function ( )
		{
			var year = $( '#xj-select-year_s option:selected' ).val ( ) ;

			$( '#xj-select-year_s').val ( year ) ;

			if ( "" == year )
			{
				self.fdate = "" ;
				self.pdate = "" ;
				self.setDuration ( year, year ) ;
				return ;
			}

			//self.setDuration ( year + '1231', year + '0101' ) ;
			self.setDuration ( year, year ) ;
			
		}) ;
		self.setDuration(self.active_select);
	}


	/*========================================================
	 絞込み期間更新
	========================================================*/
	XjStorageLoaderNews.prototype.setDuration = function ( f, p )
	{
		this.fdate = f;
		this.pdate = p;
		this.show();
	}

	/*========================================================
	 絞込みカテゴリー更新
	========================================================*/
	XjStorageLoaderNews.prototype.setDocument = function ( d )
	{
		this.documents = d;
		this.show();
	}

	/*========================================================
	 表示処理
	========================================================*/
	XjStorageLoaderNews.prototype.show = function()
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

		$.getJSON ( url, function ( data, title )
		{
			$('#xj-mainlist').empty ( ) ;

			var cont = '';

			if ( data.items )
			{
				var j = 0 ;
				var now_dd = new Date ( ) ;

				$.each ( data.items, function ( i, item )
				{
					// 目的の文書番号でなかったら
					if ( -1 == self.ary_doc_no.indexOf ( item.disclosureCode ) )
					{
						return true;
					}

					
					// 日付設定
					var date = item.publishDate.split(' ')[0].split('/');
					var dateStr = date[0] + '年' + date[1] + '月' + date[2]  + '日';
					var date_dd = new Date ( parseInt ( date[0], 10 ),
							parseInt ( date[1], 10 ) - 1,
							parseInt ( date[2], 10 ) ) ;

					// 年度の算出
					var entry_year = Number ( date[ 0 ] ) ;
					
					if ( ( '' == self.fdate || !self.fdate ) )
					{
						if ( j < 0 )
						{
							return true ;
						}
					}
					
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
					
					cont += '</dd>' ;
					
					if ( url != '' && size != '－' )
					{
						
						cont += '<a href="' + url + '" target="_blank" class="pdf_link">' ;
						cont += '<span>（' + size + 'B）</span></a>' ;
					}
					
					// 30日以内だったら
					/*if ( 30 * 86400000 >= now_dd.getTime ( ) - date_dd.getTime ( ) )
					{
						cont += '<span class="new">[NEW!]</span>' ;
					}*/
					
					cont += '</dl>' ;
					

					j++ ;
				});
			}

			if ( cont == '' )
			{
			cont += '<dl><dd>ただいま掲載すべき事項はございません。</dd></dl>' ;
			}

			$('#xj-mainlist').append ( cont ) ;
		});
	}

}());