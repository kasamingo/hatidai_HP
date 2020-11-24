// JavaScript Document

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
	XjStorageLoaderKokokuEn= function(s)
	{
		var defaults =
		{
			domain:'//www.xj-storage.jp',
			company:'AS02693',
			full:			'1',
			icon:			'1',
			pdf:			'1',
			len:'',
			documents_all:'',
			documents_Kessan:'600'

		};

		this.settings = $.extend ( defaults, s ) ;
		this.fdate ;
		this.pdate ;
		this.documents ;
		this.ary_doc_no ;
		this.ary_doc_Kessan ;



		XjStorageLoaderKokokuEn.prototype.init.call(this);
 	};

	/*========================================================
	 初期設定
	========================================================*/
	XjStorageLoaderKokokuEn.prototype.init = function()
	{
		$.ajaxSetup({scriptCharset:'utf-8'});

		this.ary_doc_Kessan  = this.settings.documents_Kessan.split ( "," ) ;


		this.settings.documents_all =
					this.settings.documents_Kessan ;



		this.documents = this.settings.documents_all;
		this.ary_doc_no = this.settings.documents_all.split ( "," ) ;

		this.show();
	};

	/*========================================================
	 表示処理
	========================================================*/
	XjStorageLoaderKokokuEn.prototype.show = function()
	{
		var url =  this.settings.domain + '/public-list/GetList.aspx?company=';
		var self = this;
		var is_first = true;

		url+= this.settings.company;

		if (this.fdate && this.fdate.length > 0)
		{
			url+= '&fdate=' + this.fdate;
		}

		if (this.pdate && this.pdate.length > 0)
		{
			url+= '&pdate=' + this.pdate;
		}

		if ( this.documents && this.documents.length > 0 )
		{
			url+= '&doctype=' + this.documents ;
		}

		if ( self.settings.len && self.settings.len > 0 )
		{
			url+= '&len=' + self.settings.len ;
		}
		else
		{
			url+= '&len=10000' ;
		}

		url+= '&output=json&callback=?';

		//clipboardData.setData('text',url);

		$.getJSON ( url,
		function ( data )
		{
			$( '#xj-mainlist_en' ).empty ( ) ;

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

					var url = '' ;
					var size = '' ;
					var page = '' ;

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
					if ( size > 0 )
					{

						if ( size > 1000000 )
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


					// 日付設定
					var date = item.publishDate.split(' ')[0].split('/');
					var dateStr = date[1] + '/' + date[2] + '/' + date[0] ;
					var date_dd = new Date ( parseInt ( date[0], 10 ),
							parseInt ( date[1], 10 ) - 1,
							parseInt ( date[2], 10 ) ) ;


					// 画面表示

					cont += '<dl class="pdf" style="position: relative;">';

					//cont += '<dt>' + dateStr + '</dt>' ;

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
				});
			}
			else
			{
				cont += '<dl><dd>There is no information to be disclosed at the moment.</dd></dl>' ;

			}

			$('#xj-mainlist_en').append ( cont ) ;
		});
	}

}());
