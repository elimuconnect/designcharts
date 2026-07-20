/*==================================================
    SCHOOL WALL CHART DESIGNER PRO
    templates.js
==================================================*/


/*=========================================
CLEAR DESIGN
=========================================*/

function clearDesign(){

    canvas.clear();

    canvas.backgroundColor="#ffffff";

    applyPaperSize(currentPaper);

}


/*=========================================
TITLE
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


/*=========================================
SUBTITLE
=========================================*/

function createSubtitle(text){

    return new fabric.Textbox(text,{

        left:100,

        top:160,

        width:canvas.width-200,

        fontSize:34,

        fill:"#444",

        textAlign:"center",

        fontFamily:"Poppins"

    });

}


/*=========================================
BODY
=========================================*/

function createBody(text,left,top,width){

    return new fabric.Textbox(text,{

        left:left,

        top:top,

        width:width,

        fontSize:30,

        lineHeight:1.4,

        fill:"#222",

        fontFamily:"Poppins"

    });

}


/*=========================================
HEADER BAR
=========================================*/

function addHeaderBar(color){

    canvas.add(

        new fabric.Rect({

            left:0,

            top:0,

            width:canvas.width,

            height:140,

            fill:color,

            selectable:false

        })

    );

}


/*=========================================
FOOTER
=========================================*/

function addFooter(){

    canvas.add(

        new fabric.Rect({

            left:0,

            top:canvas.height-70,

            width:canvas.width,

            height:70,

            fill:"#1565C0",

            selectable:false

        })

    );

    canvas.add(

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

    );

}


/*=========================================
MATHEMATICS TEMPLATE
=========================================*/

function mathematicsTemplate(){

    clearDesign();

    addHeaderBar("#1565C0");

    canvas.add(

        new fabric.Text(

            "MATHEMATICS",

            {

                left:0,

                top:35,

                width:canvas.width,

                textAlign:"center",

                fill:"white",

                fontSize:78,

                fontWeight:"bold",

                fontFamily:"Poppins"

            }

        )

    );

    canvas.add(

        createBody(

`✓ Numbers

✓ Fractions

✓ Decimals

✓ Percentages

✓ Ratio

✓ Algebra

✓ Geometry

✓ Statistics`,

70,

220,

650

        )

    );

    canvas.add(

        new fabric.Rect({

            left:900,

            top:220,

            width:520,

            height:700,

            fill:"#E3F2FD",

            stroke:"#1565C0",

            strokeWidth:3,

            rx:20,

            ry:20

        })

    );

    canvas.add(

        new fabric.Text(

            "Illustration Area",

            {

                left:1020,

                top:520,

                fontSize:42,

                fill:"#1565C0"

            }

        )

    );

    addFooter();

}


/*=========================================
SCIENCE TEMPLATE
=========================================*/

function scienceTemplate(){

    clearDesign();

    addHeaderBar("#2E7D32");

    canvas.add(

        new fabric.Text(

            "SCIENCE",

            {

                left:0,

                top:35,

                width:canvas.width,

                textAlign:"center",

                fill:"white",

                fontSize:78,

                fontWeight:"bold"

            }

        )

    );

    canvas.add(

        createBody(

`• Living Things

• Human Body

• Plants

• Energy

• Matter

• Weather

• Environment

• Experiments`,

80,

220,

700

        )

    );

    canvas.add(

        new fabric.Circle({

            radius:220,

            fill:"#C8E6C9",

            left:980,

            top:300

        })

    );

    canvas.add(

        new fabric.Text(

            "Science Image",

            {

                left:1030,

                top:500,

                fontSize:40,

                fill:"#1B5E20"

            }

        )

    );

    addFooter();

}


/*=========================================
ENGLISH TEMPLATE
=========================================*/

function englishTemplate(){

    clearDesign();

    addHeaderBar("#8E24AA");

    canvas.add(

        new fabric.Text(

            "ENGLISH",

            {

                left:0,

                top:35,

                width:canvas.width,

                textAlign:"center",

                fill:"white",

                fontSize:78,

                fontWeight:"bold"

            }

        )

    );

    canvas.add(

        createBody(

`Grammar

Reading

Writing

Listening

Speaking

Vocabulary

Comprehension

Creative Writing`,

90,

220,

650

        )

    );

    canvas.add(

        new fabric.Rect({

            left:930,

            top:260,

            width:500,

            height:650,

            fill:"#F3E5F5",

            stroke:"#8E24AA",

            strokeWidth:3,

            rx:15,

            ry:15

        })

    );

    canvas.add(

        new fabric.Text(

            "Insert Picture",

            {

                left:1050,

                top:520,

                fill:"#8E24AA",

                fontSize:40

            }

        )

    );

    addFooter();

}


/*=========================================
LOAD TEMPLATE
=========================================*/

function loadTemplate(name){

    switch(name){

        case "math":

            mathematicsTemplate();

            break;

        case "science":

            scienceTemplate();

            break;

        case "english":

            englishTemplate();

            break;

    }

}


/*=========================================
GLOBAL
=========================================*/

window.chartTemplates={

    mathematicsTemplate,

    scienceTemplate,

    englishTemplate,

    loadTemplate

};
