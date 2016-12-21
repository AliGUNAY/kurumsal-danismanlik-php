!function ($) {

    $(function() {

        /* fuel ux tree
         ---------------------------------------------------------------------------------------- */
        /*var dataSourceTree = new DataSourceTree({
            data: [
                { name: 'Test Folder 1', type: 'folder', additionalParameters: { id: 'F1' } },
                { name: 'Test Folder 2', type: 'folder', additionalParameters: { id: 'F2' } },
                { name: 'Test Item 1', type: 'item', additionalParameters: { id: 'I1' } },
                { name: 'Test Item 2', type: 'item', additionalParameters: { id: 'I2' } }
            ],
            delay: 400
        });*/

        // INITIALIZING TREE
        var treeDataSource = new DataSourceTree({
            data: [
                { name: 'Sales', type: 'folder', additionalParameters: { id: 'F1' } },
                { name: 'Projects', type: 'folder', additionalParameters: { id: 'F2' } },
                { name: 'Reports', type: 'item', additionalParameters: { id: 'I1' } },
                { name: 'Finance', type: 'item', additionalParameters: { id: 'I2' } }
            ],
            delay: 400
        });


         var treeDataSource2 = new DataSourceTree({
         data: [
         { name: 'System Logs <div class="tree-actions"></div>', type: 'folder', additionalParameters: { id: 'F11' } },
         { name: 'Notifications <div class="tree-actions"></div>', type: 'folder', additionalParameters: { id: 'F12' } },
         { name: '<i class="fa fa-bell"></i> Alerts', type: 'item', additionalParameters: { id: 'I11' } },
         { name: '<i class="fa fa-bar-chart-o"></i> Tasks', type: 'item', additionalParameters: { id: 'I12' } }
         ],
         delay: 400
         });

         var treeDataSource3 = new DataSourceTree({
         data: [
         { name: 'Resources <div class="tree-actions"></div>', type: 'folder', additionalParameters: { id: 'F11' } },
         { name: 'Projects <div class="tree-actions"></div>', type: 'folder', additionalParameters: { id: 'F12' } },
         { name: 'Nike Promo 2013', type: 'item', additionalParameters: { id: 'I11' } },
         { name: 'IPO Reports', type: 'item', additionalParameters: { id: 'I12' } }
         ],
         delay: 400
         });

         var treeDataSource4 = new DataSourceTree({
         data: [
         { name: 'Projects<div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'folder', additionalParameters: { id: 'F11' } },
         { name: 'Reports<div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'folder', additionalParameters: { id: 'F12' } },
         { name: '<i class="fa fa-user"></i> Member <div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div><div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'item', additionalParameters: { id: 'I11' } },
         { name: '<i class="fa fa-calendar"></i> Events <div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'item', additionalParameters: { id: 'I12' } },
         { name: '<i class="fa fa-suitcase"></i> Portfolio <div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'item', additionalParameters: { id: 'I12' } }
         ],
         delay: 400
         });

         var treeDataSource5 = new DataSourceTree({
         data: [
         { name: 'Projects<div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'folder', additionalParameters: { id: 'F11' } },
         { name: 'Reports<div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'folder', additionalParameters: { id: 'F12' } },
         { name: '<i class="fa fa-user"></i> Member <div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div><div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'item', additionalParameters: { id: 'I11' } },
         { name: '<i class="fa fa-calendar"></i> Events <div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'item', additionalParameters: { id: 'I12' } },
         { name: '<i class="fa fa-suitcase"></i> Portfolio <div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'item', additionalParameters: { id: 'I12' } }
         ],
         delay: 400
         });

         var treeDataSource6 = new DataSourceTree({
         data: [
         { name: 'Projects<div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'folder', additionalParameters: { id: 'F11' } },
         { name: 'Reports<div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'folder', additionalParameters: { id: 'F12' } },
         { name: '<i class="fa fa-user"></i> Member <div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div><div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'item', additionalParameters: { id: 'I11' } },
         { name: '<i class="fa fa-calendar"></i> Events <div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'item', additionalParameters: { id: 'I12' } },
         { name: '<i class="fa fa-suitcase"></i> Portfolio <div class="tree-actions"><i class="fa fa-plus"></i><i class="fa fa-trash-o"></i><i class="fa fa-refresh"></i></div>', type: 'item', additionalParameters: { id: 'I12' } }
         ],
         delay: 400
         });

        $('#treeFolder').tree({
            dataSource: treeDataSource,
            loadingHTML: '<i class="fa fa-download"></i>',
            multiSelect: true,
            cacheItems: true
        });

        $('#treeFolder2').tree({
            dataSource: treeDataSource2,
            loadingHTML: '<i class="fa fa-download"></i>',
            multiSelect: true,
            cacheItems: true
        });

        $('#treeFolder3').tree({
            dataSource: treeDataSource3,
            loadingHTML: '<i class="fa fa-download"></i>',
            multiSelect: true,
            cacheItems: true
        });

        $('#treeFolder4').tree({
            dataSource: treeDataSource4,
            loadingHTML: '<i class="fa fa-download"></i>',
            multiSelect: true,
            cacheItems: true
        });

        $('#treeFolder5').tree({
            dataSource: treeDataSource5,
            loadingHTML: '<i class="fa fa-download"></i>',
            multiSelect: true,
            cacheItems: true
        });

        $('#treeFolder6').tree({
            dataSource: treeDataSource6,
            loadingHTML: '<i class="fa fa-download"></i>',
            multiSelect: true,
            cacheItems: true
        });
    });
}(window.jQuery);