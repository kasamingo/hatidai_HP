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
			len:'10000',//最大取得件数設定
			documents_all:'',
			documents_Disclosure:'0,5,6,8,9,13,24,25,28',
			documents_Fresults:'1,2,3,4,16,17,18,19,20,21',
			documents_Sreport:'99,105,106,107,108,1030,1040,1080,1090,1100,1120,1130,1135,1136,1140,1150,1160,1170,1180,1190,1200,1210,1220,1230,1235,1236,1240,1250,1260,1270,1280,1290,1300,1310,1320,1350,1360',
			// documents_Shareholder:'96,101,102,103,104',
			documents_Ir:'34,90,91,92,93,95,97,98,110,111,112,113,114,115,116,117,118,119,120',
			documents_Info:'14,200'
		};

		this.settings = $.extend ( defaults, s ) ;
		this.fdate;
		this.pdate;
		this.documents;
		this.select_latest = '';
		this.select_oldest = '';

		this.ary_doc_no ;
		this.ary_doc_Disclosure ;
		this.ary_doc_Fresults ;
		this.ary_doc_Sreport ;
		this.ary_doc_Ir ;
		this.ary_doc_Info ;

		XjStorageLoaderNews.prototype.init.call(this);
 	};

	/*========================================================
	 初期設定
	========================================================*/
	XjStorageLoaderNews.prototype.init = function()
	{
		$.ajaxSetup ( { scriptCharset:'utf-8' } ) ;

		//$.ajaxSetup({scriptCharset:'shift_jis'});
		this.ary_doc_Disclosure  = this.settings.documents_Disclosure.split ( "," )
		this.ary_doc_Fresults	= this.settings.documents_Fresults.split ( "," ) ;
		this.ary_doc_Sreport  = this.settings.documents_Sreport.split ( "," ) ;
		this.ary_doc_Ir  = this.settings.documents_Ir.split ( "," ) ;
		this.ary_doc_Info  = this.settings.documents_Info.split ( "," ) ;

		//全部
		this.settings.documents_all =
					this.settings.documents_Disclosure + ',' +
					this.settings.documents_Fresults + ',' +
					this.settings.documents_Sreport + ',' +
					this.settings.documents_Ir + ',' +
					this.settings.documents_Info ;

		//初期読み込み対象指定
		this.ary_doc_no = this.settings.documents_all.split ( "," ) ;

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
						return true ;
					}

					var date = item.publishDate.split(' ')[ 0 ].split( '/' ) ;
					var entry_year = date[ 0 ] ;

					//最新の年月期と最古の年月期を取得
					if ( self.select_latest === '' || self.select_latest < entry_year )
					{
						self.select_latest = entry_year ;
					}

					if ( self.select_oldest === '' || self.select_oldest >= entry_year )
					{
						self.select_oldest = entry_year ;
					}
				});
			},
			complete : function ( )
			{
				self.setDateButton ( ) ;
				self.setDocumentButton ( ) ;
                /*表示修正201807@藤原========================*/
                self.setPageButton();
                /*========================表示修正201807@藤原*/
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
		var ul = $( '#xj-select-year_set' ) ;
		var tmp = $('<div data-year="" class="selected">全て</div>');

        ul.append(tmp);

        //年範囲分年メニュー生成
        for (var i = self.select_latest; i >= self.select_oldest; i--) {

            tmp = $('<div data-year="' + i + '">' + i + '年</div>');//文字列調整201807@藤原

            ul.append(tmp);
        }

        ul.find('div').click(function () {
            /*表示修正201807@藤原========================*/
            
            $('#xj-mainlist').attr('data-page', 1);
            
            $('#xj-select-year_s').find('div').removeClass('selected')
            $(this).addClass('selected');
            var year = $(this).attr('data-year');

            $('#xj-select-year_s').attr('data-year', year);

            if ("" == year) {
                self.fdate = "";
                self.pdate = "";
                self.setDuration(year, year);
                return;
            }

            self.setDuration ( year + '1231', year + '0101' ) ;
            
            /*========================表示修正201807@藤原*/
        });
	}

	/*========================================================
	 カテゴリー選択ボタン生成
	========================================================*/
	XjStorageLoaderNews.prototype.setDocumentButton = function ( )
	{
		var self = this;

		//カテゴリーボタン生成
		//var ul = $( '#xj-select-category_s' ) ;

		var ul = $( '#xj-select-category_set' );

		ul.append (
				$( '<div class="active"></div>' ).click ( function ( )
				{
					self.setDocument ( self.settings.documents_all ) ;
				}
				).append ( '<a href="javascript:void(0)" >全て</a>' ) ) ;

		ul.append (
				$('<div></div>').click ( function ( )
				{
					self.setDocument ( self.settings.documents_Disclosure ) ;
				}
				).append ( '<a href="javascript:void(0)">適時開示</a>' ) ) ;

		ul.append (
				$( '<div></div>' ).click ( function ( )
				{
					self.setDocument ( self.settings.documents_Fresults ) ;
				}
				).append ( '<a href="javascript:void(0)">決算短信</a>' ) ) ;

		ul.append (
				$( '<div></div>' ).click ( function ( )
				{
					self.setDocument ( self.settings.documents_Sreport ) ;
				}
				).append ( '<a href="javascript:void(0)">法定開示</a>' ) ) ;

		ul.append (
				$ ( '<div></div>' ).click ( function ( )
				{
					self.setDocument ( self.settings.documents_Ir ) ;
				}
				).append ( '<a href="javascript:void(0)">IR資料</a>' ) ) ;

		ul.append (
				$ ( '<div></div>' ).click ( function ( )
				{
					self.setDocument ( self.settings.documents_Info ) ;
				}
				).append ( '<a href="javascript:void(0)">お知らせ</a>' ) ) ;


		//$( '#xj-select-category' ).append ( ul ) ;



		//カテゴリー選択ボタンロールオーバー等
		$ ( '#xj-select-category_set div' ).click ( function ( )
		{
			$( '#xj-select-category_set div.active' ).removeClass ( 'active') ;
			$( this ).addClass( 'active' ) ;
		});

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
        $('#xj-mainlist').attr('data-page', 1);
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

		// 日付範囲指定
		if ( this.fdate && this.fdate.length > 0 )
		{
			url+= '&fdate=' + this.fdate;
		}

		if ( this.pdate && this.pdate.length > 0 )
		{
			url+= '&pdate=' + this.pdate;
		}


		// 取得個数指定
		if ( !( this.pdate && this.pdate.length > 0 ) &&
				!( this.fdate && this.fdate.length > 0 ) )
		{
			url+= '&len=' + self.settings.len;
		}
		else
		{
			url+= '&len=10000';
		}


		// タイプ指定
		if ( this.documents && this.documents.length > 0 )
		{
			url+= '&doctype=' + this.documents;
		}

		//url+= '&filetype=PDF-GENERAL';
		url+= '&output=json&callback=?';
        
		$.getJSON ( url, function ( data )
		{
			$('#xj-mainlist').empty ( ) ;

			var cont = '';
            /*表示修正201807@藤原========================*/
            $('.pager_ja').remove();
            var pagePeriod = 10;
            var c = $('#xj-mainlist').attr('data-page') - 1;
            if(c < 0){
               c = 0;
            }
            c = c * pagePeriod;
            /*========================表示修正201807@藤原*/

			if ( data.items )
			{

				var j = 0 ;
				var now_dd = new Date ( ) ;

				$.each ( data.items, function ( i, item )
				{
					// 目的の文書番号でなかったら
                    if (-1 == self.ary_doc_no.indexOf(item.disclosureCode)) {
                        return true;
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
							else if ( file.type == 'HTML-GENERAL')
							{
								url = file.url ;

							}
						});
					}

					// サイズ設定
					if ( size > 0 )
					{
						if ( size > 1000000)
						{
							size = parseInt ( size / 1000000 ) + 'M' ;
						}
						else if ( size > 1000 )
						{
							size = parseInt ( size / 1000 ) + 'K' ;
						}
					}
					else
					{
						size = '－' ;
					}


					// アイコンファイル設定
					var icon_class = '' ;
					var icon_alt = '' ;

					if ( -1 != self.ary_doc_Disclosure.indexOf ( item.disclosureCode ) )
					{
						icon_class = 'icon_discro';
						icon_alt = '適時開示';
					}
					else if ( -1 != self.ary_doc_Fresults.indexOf ( item.disclosureCode ) )
					{
						icon_class = 'icon_result';
						icon_alt = '決算短信';
					}
					else if ( -1 != self.ary_doc_Sreport.indexOf ( item.disclosureCode ) )
					{
						icon_class = 'icon_legal';
						icon_alt = '法定開示';
					}
					else if ( -1 != self.ary_doc_Ir.indexOf ( item.disclosureCode ) )
					{
						icon_class = 'icon_ir';
						icon_alt = 'IR資料';
					}
					else if ( -1 != self.ary_doc_Info.indexOf ( item.disclosureCode ) )
					{
						icon_class = 'icon_info';
						icon_alt = 'お知らせ';
					}

					// 日付設定
					var date = item.publishDate.split(' ')[0].split('/');
					var dateStr = date[0] + '.' + date[1] + '.' + date[2];
					var date_dd = new Date ( parseInt ( date[0], 10 ),
							parseInt ( date[1], 10 ) - 1,
							parseInt ( date[2], 10 ) ) ;


					// 画面表示
                    /*表示修正201807@藤原========================*/
                    j++;//j++の位置を変更
                    //表示範囲外だったなら
                    if(j <= c || j > c + pagePeriod){
                       return true;
                    }
                    /*========================表示修正201807@藤原*/


					cont += '<dl class="pdf" style="position: relative;">';

					cont += '<dt>' + dateStr + '</dt>' ;

					cont += '<dd class="label '+ icon_class +'"><span>'+ icon_alt +'</span></dd>' ;


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
						cont += '<a href="' + url + '" target="_blank" class="pdf_link"><span>' ;
						cont += '（' + size + 'B）</span></a>' ;
					}

					// 30日以内だったら
					/*if ( 30 * 86400000 >= now_dd.getTime ( ) - date_dd.getTime ( ) )
					{
						cont += '<span class="new">[NEW!]</span>' ;
					}*/

					cont += '</dl>' ;
				});
			}

			if ( '' == cont )
			{
				cont += '<dl><dd>ただいま掲載すべき事項はございません。</dd></dl>' ;
			}



			$('#xj-mainlist').append ( cont ) ;
            
            /*表示修正201807@藤原========================*/
            //ページャーの追加
            var setPage = Math.ceil(j/pagePeriod);
            var currentPage = $('#xj-mainlist').attr('data-page');
            
            if(setPage >= 2){
                var startCount = $('#xj-mainlist').attr('data-page') - 2;
                if(startCount <= 1){
                   startCount = 1;
                }
                
                var endCount = startCount + 4;
                if(endCount >= setPage){
                   endCount = setPage;
                   startCount = endCount - 4;
                }
                
                if(setPage <= 5){
                   startCount = 1;
                }
                
                $('#xj_mainlist_pager_ja').append('<div class="pager pager_ja mlang-visible ja"></div>');
                
                var pageCount = '<a class="prev pb_ja" rel="prev"></a>';
                for(i=startCount;i<=endCount;i++){
                    pageCount = pageCount + '<a class="pb_ja">'+(i)+'</a>'
                    
                }
                pageCount = pageCount + '<a class="next pb_ja" rel="next"></a>';
                
                $('.pager_ja').append(pageCount);
                
                $('.pb_ja').each(function(i){
                    if($(this).html() == currentPage){
                        $(this).addClass('active');
                    }
                });
                
                if($('.pb_ja.active').html() == '1'){
                    $('.pb_ja.prev').addClass('hidepager');
                }
                
                if($('.pb_ja.active').html() == setPage){
                   $('.pb_ja.next').addClass('hidepager');
                }
            }
            /*========================表示修正201807@藤原*/
            
        });
    }
    
    /*表示修正201807@藤原========================*/
    XjStorageLoaderNews.prototype.setPageButton = function () {
        var self = this;
        self.active_select = self.select_latest;
        
        $(document).on('click','.pb_ja',function () {
            var transPage = $('#xj-mainlist').attr('data-page');
            if($(this).hasClass('prev')){
               transPage = Number(transPage) - 1;
            }
            if($(this).hasClass('next')){
               transPage = Number(transPage) + 1;
            }
            if($(this).html()){
               transPage = Number($(this).html())
            }

            $('#xj-mainlist').attr('data-page', transPage);
            
            var year = $('#xj-select-year_s').attr('data-year');
            if ("" == year || undefined === year) {
                self.fdate = "";
                self.pdate = "";
                self.setDuration(year, year);
                return;
            }

            self.setDuration ( year + '1231', year + '0101' ) ;
        });
    }
    /*========================表示修正201807@藤原*/

}());
