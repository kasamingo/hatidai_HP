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
	 コンストラクタAS02693
	========================================================*/
	XjStorageLoaderIrLibE = function(s)
	{
		var defaults =
		{
			domain:'//www.xj-storage.jp',
			company:'AS02693',
			full:			'1',
			icon:			'1',
			pdf:			'1',
			len:'3',
			documents_all:'',
			documents_Disclosure:'15,209',
			documents_Fresults:'201',
			documents_Presentation:'202',
			documents_Sreport:'203,204',
			documents_Meeting:'208',
			documents_Ir:'90,92,93,95,97,110,113,114,115,116,117,118,119,120'

		};

		this.settings = $.extend ( defaults, s ) ;
		this.fdate ;
		this.pdate ;
		this.documents ;
		this.ary_doc_no ;
		this.ary_doc_Disclosure ;
		this.ary_doc_Fresults ;
		this.ary_doc_Presentation ;
		this.ary_doc_Sreport ;
		this.ary_doc_Meeting ;
		this.ary_doc_Ir ;




		XjStorageLoaderIrLibE.prototype.init.call(this);
 	};

	/*========================================================
	 初期設定
	========================================================*/
	XjStorageLoaderIrLibE.prototype.init = function()
	{
		$.ajaxSetup({scriptCharset:'utf-8'});

		this.ary_doc_Disclosure  = this.settings.documents_Disclosure.split ( "," )
		this.ary_doc_Fresults	= this.settings.documents_Fresults.split ( "," ) ;
		this.ary_doc_Presentation	= this.settings.documents_Presentation.split ( "," ) ;
		this.ary_doc_Sreport  = this.settings.documents_Sreport.split ( "," ) ;
		this.ary_doc_Ir  = this.settings.documents_Ir.split ( "," ) ;
		this.ary_doc_Meeting  = this.settings.documents_Meeting.split ( "," ) ;


		this.settings.documents_all =
					this.settings.documents_Disclosure + ',' +
					this.settings.documents_Fresults + ',' +
					this.settings.documents_Presentation + ',' +
					this.settings.documents_Sreport + ',' +
					this.settings.documents_Ir + ',' +
					this.settings.documents_Meeting ;



		this.documents = this.settings.documents_all;
		this.ary_doc_no = this.settings.documents_all.split ( "," ) ;

		this.show();
	};

	/*========================================================
	 表示処理
	========================================================*/
	XjStorageLoaderIrLibE.prototype.show = function()
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
		else if ( !( this.pdate && this.pdate.length > 0 ) &&
				!( this.fdate && this.fdate.length > 0 ) )
		{
			url+= '&len=4' ;
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
			//$( '#xj-mainlist-liben' ).empty ( ) ;

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

					// アイコンファイル設定
					var icon_class = '' ;
					var icon_alt = '' ;


					if ( -1 != self.ary_doc_Disclosure.indexOf ( item.disclosureCode ) )
					{
						icon_class = 'icon_discro';
						icon_alt = 'Timely Disclosure Information';
					}
					else if ( -1 != self.ary_doc_Fresults.indexOf ( item.disclosureCode ) )
					{
						icon_class = 'icon_result';
						icon_alt = 'Financial Results';
					}
					else if ( -1 != self.ary_doc_Presentation.indexOf ( item.disclosureCode ) )
					{
						icon_class = 'icon_presen';
						icon_alt = 'Financial Results Briefing Materials';
					}
					else if ( -1 != self.ary_doc_Sreport.indexOf ( item.disclosureCode ) )
					{
						icon_class = 'icon_yuho';
						icon_alt = 'Securities Report';
					}
					else if ( -1 != self.ary_doc_Ir.indexOf ( item.disclosureCode ) )
					{
						icon_class = 'icon_ir';
						icon_alt = 'Other IR Materials';
					}
					else if ( -1 != self.ary_doc_Meeting.indexOf ( item.disclosureCode ) )
					{
						icon_class = 'icon_meeting';
						icon_alt = 'Shareholders Meeting Documents';
					}

					// 日付設定
					var date = item.publishDate.split(' ')[0].split('/');
					var dateStr = date[0] + '.' + date[1] + '.' + date[2] ;
					var date_dd = new Date ( parseInt ( date[0], 10 ),
							parseInt ( date[1], 10 ) - 1,
							parseInt ( date[2], 10 ) ) ;


					// 画面表示


					if  ( url != '')
					{
						cont += '<a href="' + url + '" target="_blank" class="content">';
					}


					cont += '<div class="inner">';
					cont += '<div class="date">' + dateStr + '</div>' ;
					cont += '<div class="type">'+ icon_alt +'</div>' ;

					cont += '<div class="text">' ;

					cont += item.title ;

					if ( url != '' && size != '－' )
					{

						//cont += '（' + size + 'B）<img src="img/pdf.gif" alt="PDF" style="vertical-align:middle;">' ;
					}

					cont += '<div class="wrapper_pdf"><span class="pdf"></span>PDF(' + size + 'B)</div></div>' ;
					cont += '</div>' ;


					if ( url != '' )
					{
						cont += '</a>' ;
					}

				});
			}
			else
			{
				cont += '<p>There is no document.</p>' ;

			}

			$('.ir_library_container_en').append ( cont ) ;
			$('.ir_library_container_en').slick({
		    infinite: false,
		    accessibility: false,
		    arrows: false,
		    variableWidth: true
		  });
			var width = $(window).width();
	    if (width <= 767) {
	      $('.ir_library_container_en').not('.slick-initialized').slick({
	        infinite: false,
	        accessibility: false,
	        arrows: false,
	        variableWidth: true
	      });

	    } else {
	      $('.ir_library_container_en').slick('unslick');
	    }
		});
	}

}());

$(function(){
		var xj_storage_loader = new XjStorageLoaderIrLibE();
	});
