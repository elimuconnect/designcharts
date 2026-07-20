/*==================================================
    SCHOOL WALL CHART DESIGNER PRO
    layers.js
==================================================*/


/*=========================================
REFRESH LAYERS PANEL
=========================================*/

function refreshLayers(){


    let panel =
    document.getElementById("layersPanel");


    if(!panel || !canvas)
        return;



    panel.innerHTML="";



    let objects =
    canvas.getObjects().slice().reverse();



    objects.forEach((obj,index)=>{


        let item=document.createElement("div");


        item.className="layer-item";


        item.innerHTML=`

        <span>
        ${obj.name || obj.type || "Object"}
        </span>

        <button>
        👁
        </button>

        `;



        item.onclick=function(){


            canvas.discardActiveObject();


            canvas.setActiveObject(obj);


            canvas.renderAll();


        };



        let eye =
        item.querySelector("button");



        eye.onclick=function(e){


            e.stopPropagation();


            obj.visible =
            !obj.visible;


            canvas.renderAll();


        };



        panel.appendChild(item);



    });



}





/*=========================================
UPDATE AFTER ADD / DELETE
=========================================*/


canvas.on(
"object:added",
refreshLayers
);


canvas.on(
"object:removed",
refreshLayers
);


canvas.on(
"object:modified",
refreshLayers
);





/*=========================================
DELETE SELECTED LAYER
=========================================*/


function deleteLayer(obj){


    if(!obj)
        return;


    canvas.remove(obj);


    canvas.renderAll();


}





window.layersManager={

    refreshLayers

};
