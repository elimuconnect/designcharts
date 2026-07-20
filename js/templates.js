/*==================================================
    SCHOOL WALL CHART DESIGNER PRO
    templates.js
==================================================*/


/*=========================================
CLEAR DESIGN
=========================================*/

function clearDesign(){

    if(!confirm("Replace the current design?")) return;


    canvas.getObjects().forEach(obj=>{
        canvas.remove(obj);
    });


    canvas.backgroundColor="#ffffff";

    canvas.discardActiveObject();

    canvas.requestRenderAll();


    if(typeof refreshLayers==="function")
        refreshLayers();


    if(typeof saveHistory==="function")
        saveHistory();

}



/*=========================================
CORE ADD FUNCTION
=========================================*/

function addTemplateObjects(...objects){

    objects.forEach(obj=>{

        if(obj)
            canvas.add(obj);

    });


    canvas.requestRenderAll();


    if(typeof refreshLayers==="function")
        refreshLayers();


    if(typeof saveHistory==="function")
        saveHistory();

}




/*=========================================
TEXT HELPERS
=========================================*/


function createTitle(text,color="#1565C0"){

    return new fabric.Textbox(text,{

        left:100,

        top:60,

        width:canvas.width-200,

        fontSize:70,

        fontWeight:"bold",

        fill:color,

        textAlign:"center",

        fontFamily:"Poppins"

    });

}



function createSectionTitle(text,color){

    return new fabric.Textbox(text,{

        left:80,

        top:220,

        width:700,

        fontSize:50,

        fontWeight:"bold",

        fill:color,

        fontFamily:"Poppins"

    });

}




function createBody(text,left,top,width){

    return new fabric.Textbox(text,{

        left,

        top,

        width,

        fontSize:30,

        lineHeight:1.4,

        fill:"#222",

        fontFamily:"Poppins"

    });

}



/*=========================================
SHAPE HELPERS
=========================================*/


function createBox(left,top,width,height,color="#E3F2FD",stroke="#1565C0"){

    return new fabric.Rect({

        left,

        top,

        width,

        height,

        fill:color,

        stroke,

        strokeWidth:3,

        rx:20,

        ry:20

    });

}



function createImagePlaceholder(
    text="Insert Image",
    left=900,
    top=250
){

    return [

        createBox(
            left,
            top,
            500,
            600
        ),

        new fabric.Text(
            text,
            {
                left:left+100,
                top:top+260,
                fontSize:40,
                fill:"#1565C0",
                fontFamily:"Poppins"
            }
        )

    ];

}





/*=========================================
HEADER
=========================================*/


function createHeader(color="#1565C0"){

    return new fabric.Rect({

        left:0,

        top:0,

        width:canvas.width,

        height:140,

        fill:color,

        selectable:false

    });

}





function createFooter(){

    return [

        new fabric.Rect({

            left:0,

            top:canvas.height-70,

            width:canvas.width,

            height:70,

            fill:"#1565C0",

            selectable:false

        }),


        new fabric.Text(

            "School Wall Chart Designer Pro",

            {

                left:40,

                top:canvas.height-50,

                fill:"white",

                fontSize:26,

                fontFamily:"Poppins"

            }

        )

    ];

}





/*=========================================
TEMPLATE BUILDERS
=========================================*/


function createFractionsTemplate(){


    clearDesign();


    let footer=createFooter();


    addTemplateObjects(

        createHeader("#1565C0"),


        createTitle(
            "FRACTIONS",
            "#ffffff"
        ),


        createSectionTitle(
            "Understanding Fractions",
            "#1565C0"
        ),


        createBody(

`✓ Numerator

✓ Denominator

✓ Equivalent Fractions

✓ Adding Fractions

✓ Comparing Fractions`,

80,

320,

700

        ),


        ...createImagePlaceholder(
            "Fraction Diagram",
            900,
            250
        ),


        ...footer

    );

}




function createAnglesTemplate(){


    clearDesign();


    addTemplateObjects(

        createHeader("#EF6C00"),


        createTitle(
            "ANGLES",
            "#ffffff"
        ),


        createBody(

`Types of Angles

• Acute Angle

• Right Angle

• Obtuse Angle

• Straight Angle

• Reflex Angle`,

100,

250,

700

        ),


        ...createImagePlaceholder(
            "Angle Drawing",
            900,
            250
        ),


        ...createFooter()

    );


}





function createPlantsTemplate(){


    clearDesign();


    addTemplateObjects(

        createHeader("#2E7D32"),


        createTitle(
            "PLANTS",
            "#ffffff"
        ),


        createBody(

`Plant Parts

✓ Roots

✓ Stem

✓ Leaves

✓ Flowers

✓ Seeds`,

100,

250,

700

        ),


        ...createImagePlaceholder(
            "Plant Image",
            900,
            250
        ),


        ...createFooter()

    );

}





/*=========================================
TEMPLATE LIBRARY
=========================================*/


const TEMPLATE_LIBRARY=[


{

id:"math-fractions",

title:"Fractions",

category:"Mathematics",

preview:"templates/math/fractions.png",

load:createFractionsTemplate

},


{

id:"math-angles",

title:"Angles",

category:"Mathematics",

preview:"templates/math/angles.png",

load:createAnglesTemplate

},


{

id:"science-plants",

title:"Plants",

category:"Science",

preview:"templates/science/plants.png",

load:createPlantsTemplate

}


];





/*=========================================
LOAD TEMPLATE
=========================================*/


function loadTemplate(id){

    let template=TEMPLATE_LIBRARY.find(
        t=>t.id===id
    );


    if(template){

        template.load();

    }

}





/*=========================================
EXPORT
=========================================*/


window.chartTemplates={


loadTemplate,


TEMPLATE_LIBRARY,


createFractionsTemplate,


createAnglesTemplate,


createPlantsTemplate


};
