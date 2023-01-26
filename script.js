let filter2, btn_all, Tooltip,dados2, graph, language,language2, eduBars, group, yScale, xScale,missing_label,primary_label,average_label, some_sec_label, sec_label, some_college_label, college_label, some_grad_label, graduate_label, innerRadius, outerRadius, xx, yy, colorScale, xAxis, yAxis, svg, chartDIV,genre_age, female_label, male_label, Genre_value, girls, boys, total_kids, percentage_girls, percentage_boys, age, education_age, mouseover, mousemove, mouseleave, eduBars2, geral;;
let value = 1;
let ages = 0;
let boy_color = "#8ECEFD"
let girl_color = "#ff93b9"

const canvasHeight = 520;
const canvasWidth = 1400;
const padding = 60;
const graphWidth = canvasWidth - padding * 2;
const graphHeight = canvasHeight - padding * 2;

d3.csv('data/wordbank_data.csv', d3.autoType).then(function(data) {

    // create a tooltip
    Tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
        .style("font-family", "Alexandria, sans serif")
        .style("font-size", "12px")
        .style("fill", "#3b3b3b")

    //Título e Subtítulo
    titles();

    //Escolha das linguas
    let filter = data.filter(function (d) {
        return ((d.language === "German" || d.language === "Czech" || d.language === "Latvian" || d.language === "Korean" || d.language === "Mandarin" || d.language === "Danish" || d.language === "French" || d.language === "Cantonese" || d.language === "Portuguese" || d.language === "Spanish" || d.language === "English" || d.language === "Norwegian"));
    })

    const mean_words = d3.rollup(filter, v => d3.mean(v, d => d.comprehension),
        d => d.language);

    const education = d3.rollup(filter, d => d.length,
        d => d.language, d => d.caregiver_education);

    const genre = d3.rollup(filter, d => d.length,
        d => d.language, d => d.sex);

    let dados = [];

    mean_words.forEach((d, i) => {
        let temp = {};
        temp['lingua'] = i;
        temp['mediaPalavras'] = d;
        temp['total_edu'] = d3.sum(education.get(i), (function (v) {
            return v[1];
        }))
        temp['genero'] = genre.get(i)
        temp['education'] = Array.from(education.get(i).keys()).map(function (v) {
            return {v: {
                    "valor_normalizado": education.get(i).get(v)/temp.total_edu,
                    "valor": education.get(i).get(v),
                    "edu": v
                }}
        })

        dados.push(temp);
    })

    dados.sort(function (a,b) {
        return d3.ascending(a.lingua, b.lingua);
    })

    drawGraph();

    let btn_name = document.querySelector("#b-name");
    btn_name.classList.add('is-active');
    let btn_words = document.querySelector("#b-words");

    btn_name.addEventListener("click", function () {
        btn_words.classList.remove('is-active');
        btn_name.classList.remove('is-active');
        btn_name.classList.add('is-active');

        dados.sort(function (a,b) {
            return d3.ascending(a.lingua, b.lingua);
        })

        //Ordenar alfabeticamente
        if(ages === 0){
            drawGraph();
        }else{
            drawGraphAge();
        }
    })

    btn_words.addEventListener("click", function () {
        btn_name.classList.remove('is-active');
        btn_words.classList.add('is-active');

        //Ordenar por média de palavras
        if(value === 0){
            dados.sort(function (a,b) {
                return d3.ascending(a.mediaPalavras, b.mediaPalavras);
            })
            if(ages === 0){
                drawGraph();
            }else{
                drawGraphAge();
            }
            btn_words.innerHTML = "Words <span class='arrow'>&#9650;</span>";
            value = 1;
        }else{
            dados.sort(function (a,b) {
                return d3.descending(a.mediaPalavras, b.mediaPalavras);
            })
            if (ages === 0){
                drawGraph();
            }else{
                drawGraphAge();
            }
            btn_words.innerHTML = "Words <span class='arrow'>&#9660;</span>";
            value = 0;
        }
    })

    btn_all = document.querySelector("#btn-all");
    btn_all.classList.add('is-active');

    btn_all.addEventListener("click", function () {
        //btn_all.classList.remove('is-active');
        const boxes = document.querySelectorAll('.num p');
        boxes.forEach(num => {
            num.classList.remove('is-active');
        });

        btn_all.classList.add('is-active');
        ages = 0;

        drawGraph()
    })

    for(let i=16;i<=36;i++){

        document.querySelector("#btn-"+i).addEventListener("click", function () {

            const boxes = document.querySelectorAll('.num p');
            boxes.forEach(num => {
                num.classList.remove('is-active');
            });
            document.querySelector("#btn-"+i).classList.add('is-active');

            ages = 1;
            //Ordenar por média de palavras
            filter2 = data.filter(function (d) {
                return ((d.age === i) && (d.language === "German" || d.language === "Czech" || d.language === "Latvian" || d.language === "Korean" || d.language === "Mandarin" || d.language === "Danish" || d.language === "French" || d.language === "Cantonese" || d.language === "Portuguese" || d.language === "Spanish" || d.language === "English" || d.language === "Norwegian"));
            })

            age = d3.rollup(filter2, v => d3.mean(v, d => d.comprehension),
                d => d.age, d => d.language);

            education_age = d3.rollup(filter2, d => d.length,
                d => d.age, d => d.language, d => d.caregiver_education);

            genre_age = d3.rollup(filter2, d => d.length,
                d => d.age, d => d.language, d => d.sex);

            dados2 = [];

            age.forEach((j, u) => {
                let temp = {};
                temp['age'] = u;
                temp['LinguaGroup'] = Array.from(age.get(u).keys()).map(function (v) {
                    return {v: {
                            "lingua2": v,
                            "mediaPalavras2": age.get(u).get(v),
                            "genero": genre_age.get(u).get(v)
                        }}
                })
                temp['education_age'] = Array.from(education_age.get(u).keys()).map(function (v) {
                    return {
                        v: {
                            "valor": Array.from(education_age.get(i).get(v)).map(function (z) {
                                return {
                                    z: {
                                        "edu": z[0],
                                        "valor": z[1],
                                        "valor_normalizado": z[1] / d3.sum(education_age.get(i).get(v), function (t) {
                                            return t[1];
                                        })
                                    }}
                            })
                        }
                    }
                })
                dados2.push(temp);
            })
            drawGraphAge();
        })
    }

    //Labels
    let EduLabel = d3.select("#EduLabel")
    let GenderLabel = d3.select("#GenderLabel")
    let GraphLabel = d3.select("#GraphLabel")

    label(EduLabel, primary_label, "Primary" , "Primary", 72, 50, "#febd2a","edu")
    label(EduLabel, some_sec_label, "SomeSecondary" , "Some Secondary", 122, 100, "#a6cee3","edu")
    label(EduLabel, sec_label, "Secondary" , "Secondary", 86, 65, "#1f78b4","edu")
    label(EduLabel, some_college_label, "SomeCollege" , "Some College", 104, 82, "#b2df8a","edu")
    label(EduLabel, college_label, "College" , "College", 69, 47, "#33a02c","edu")
    label(EduLabel, some_grad_label, "SomeGraduate" , "Some Graduate", 114, 93, "#fb9a99","edu")
    label(EduLabel, graduate_label, "Graduate" , "Graduate", 80, 57, "#e31a1c","edu")
    label(GenderLabel, female_label, "Female" , "Female", 72, 60, girl_color,"genre")
    label(GenderLabel, male_label, "Male" , "Male", 58, 45, boy_color,"genre")
    label(GraphLabel, average_label, "average" , "Overall Average", 128, 96, "#3b3b3b","average")
    label(GraphLabel, missing_label, "missing" , "Missing Data", 84, 81, "#b6b6b6","missing")


    //Gráfico Geral
    function drawGraph() {

        chartDIV = document.createElement("div");

        svg = d3.select(chartDIV)
            .append("svg")
            .attr('width', canvasWidth)
            .attr('height', canvasHeight)
            .style('margin-left', "22px");

        drawAxis();

        // An arc generator is produced
        let arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(d => yy(d.v.valor_normalizado))
            .startAngle((d) => {
                return xx(d.v.edu)
            })
            .endAngle((d) => xx(d.v.edu) + xx.bandwidth())
            .padAngle(0.03);

        // Three function that change the tooltip when user hover / move / leave a cell
        let mouseover = function(e,d) {
            Tooltip
                .style("opacity", 1)
            d3.select(this)
                //.style("stroke", "black")
                .style("opacity", 0.9)
        }
        let mousemove = function(e,d) {
            Tooltip
                .html(Math.round(d.v.valor_normalizado*1000) / 10 + '% ' + d.v.edu)
                .style("left", (e.pageX+15) + "px")
                .style("top", (e.pageY-30) + "px");
        }
        let mousemove2 = function(e,d) {
            Genero(d);
            if (percentage_girls > percentage_boys) {
                Tooltip
                    .html(Math.round(percentage_girls*10)/10 + '% Female')
                    .style("left", (e.pageX + 15) + "px")
                    .style("top", (e.pageY - 30) + "px");
            }else{
                Tooltip
                    .html(Math.round(percentage_boys*10)/10 + '% Male')
                    .style("left", (e.pageX + 15) + "px")
                    .style("top", (e.pageY - 30) + "px");
            }
        }
        let mousemove3 = function(e,d) {
            Genero(d);
            if (percentage_girls < percentage_boys) {
                Tooltip
                    .html(Math.round(percentage_girls*10)/10 + '% Female')
                    .style("left", (e.pageX + 15) + "px")
                    .style("top", (e.pageY - 30) + "px");
            }else{
                Tooltip
                    .html(Math.round(percentage_boys*10)/10 + '% Male')
                    .style("left", (e.pageX + 15) + "px")
                    .style("top", (e.pageY - 30) + "px");
            }
        }
        let mouseleave = function(e,d) {
            Tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("opacity", 1)
        }

        graph = svg.append('g')
            .attr('transform', 'translate(' + (padding-7) + ',' + padding + ')')
            .attr("class", "graph")


        language = graph.selectAll('g')
            .data(dados)
            .enter()
            .append('g')
            .attr("class", function (d){
                return "graph " + d.lingua;
            })

        language.append('line')
            .attr("class", function (d) {
                return "line " + d.lingua;
            })
            .attr('x1', function (d) {
                return xScale(d.lingua) + padding;
            })
            .attr('x2', function (d) {
                return xScale(d.lingua) + padding;
            })
            .attr('y1', function (d) {
                return yScale(d.mediaPalavras)+25;
            })
            .attr('y2', graphHeight)
            .style('stroke', "#b6b6b6")
            .style('stroke-width', 2)

        //CIRCULO EXTERIOR
        language.append('circle')
            .attr("class", function (d) {
                return "circle " + d.lingua;
            })
            .attr('cx', function (d) {
                return xScale(d.lingua) + padding;
            })
            .attr('cy', function (d) {
                return yScale(d.mediaPalavras);
            })
            .attr('r', 25)
            .attr('fill', function (d) {
                Genero(d);
                if (girls > boys) {
                    return girl_color
                }
                else {
                    return boy_color
                }
            })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove2)
            .on("mouseleave", mouseleave)

        //CIRCULO INTERIOR
        language.append('circle')
            .attr("class", function (d) {
                return "circle " + d.lingua;
            })
            .attr('cx', function (d) {
                return xScale(d.lingua) + padding;
            })
            .attr('cy', function (d) {
                return yScale(d.mediaPalavras);
            })
            .attr('r', function (d) {
                Genero(d);
                if (girls >= boys) {
                    return (percentage_boys * 25) / 100 // return raio rapazes
                }
                else {
                    return (percentage_girls * 25) / 100 // return raio raparigas
                }
            })
            .attr('fill', function (d) {
                Genero(d);

                if (girls <= boys) {
                    return girl_color
                }
                else {
                    return boy_color
                }
            })
            .attr('stroke', 'white')
            .attr('stroke-width', '2px')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove3)
            .on("mouseleave", mouseleave)

        language
            .on("mouseover", function() {
                d3.select(this)
                    .select(".graph line")
                    .style("stroke", "#3b3b3b")
            })
            .on("mouseleave", function() {
                d3.select(this)
                    .select(".graph line")
                    .style("stroke", "#b6b6b6")
            })


        group = language.append('g')
            .attr("id", "group")
            .attr('transform', function (d) {
                return ('translate(' + (xScale(d.lingua) + padding) + ',' + (yScale(d.mediaPalavras)) + ')');
            });

        eduBars = group.selectAll('g')
            .data(function (d) {
                return d.education
            })

        eduBars
            .enter()
            .append('g')
            .attr("class", function (d,i){
                return "Edu " + d.v.valor_normalizado + "==> " + i;
            })
            .append('path')
            .attr("class", function (d) {
                return "rect " + d.v.edu;
            })
            .attr("d", arc)
            .attr('fill', d=> colorScale(d.v.edu))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        const showChart = document.getElementById("dataviz");
        while (showChart.firstChild) {
            showChart.firstChild.remove();
        }
        showChart.appendChild(chartDIV);
    }

    //Gráfico por idades
    function drawGraphAge() {

        chartDIV = document.createElement("div");

        svg = d3.select(chartDIV)
            .append("svg")
            .attr('width', canvasWidth)
            .attr('height', canvasHeight)
            .style('margin-left', "22px");

        drawAxis();

        // An arc generator is produced
        let arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(d => yy(d.z.valor_normalizado))
            .startAngle((d) => {
                return xx(d.z.edu)
            })
            .endAngle((d) => xx(d.z.edu) + xx.bandwidth())
            .padAngle(0.03);

        // Three function that change the tooltip when user hover / move / leave a cell
        mouseover = function(e,d) {
            Tooltip
                .style("opacity", 1)
            d3.select(this)
                //.style("stroke", "black")
                .style("opacity", 0.9)
        }
        mousemove = function(e,d) {
            Tooltip
                .html(Math.round(d.z.valor_normalizado*1000) / 10 + '% ' + d.z.edu)
                .style("left", (e.pageX+15) + "px")
                .style("top", (e.pageY-30) + "px");
        }
        let mousemove2 = function(e,d) {
            GeneroAge(d);
            if (percentage_girls > percentage_boys) {
                Tooltip
                    .html(Math.round(percentage_girls*10)/10 + '% Female')
                    .style("left", (e.pageX + 15) + "px")
                    .style("top", (e.pageY - 30) + "px");
            }else{
                Tooltip
                    .html(Math.round(percentage_boys*10)/10 + '% Male')
                    .style("left", (e.pageX + 15) + "px")
                    .style("top", (e.pageY - 30) + "px");
            }
        }
        let mousemove3 = function(e,d) {
            GeneroAge(d);
            if (percentage_girls < percentage_boys) {
                Tooltip
                    .html(Math.round(percentage_girls*10)/10 + '% Female')
                    .style("left", (e.pageX + 15) + "px")
                    .style("top", (e.pageY - 30) + "px");
            }else{
                Tooltip
                    .html(Math.round(percentage_boys*10)/10 + '% Male')
                    .style("left", (e.pageX + 15) + "px")
                    .style("top", (e.pageY - 30) + "px");
            }
        }
        mouseleave = function(e,d) {
            Tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("opacity", 1)
        }

        let graph2 = svg.append('g')
            .attr('transform', 'translate(' + (padding-7) + ',' + padding + ')')
            .attr("class", "graph by age")

        let missingData = graph2.selectAll('line')
            .data(dados)
            .enter()
            .append('line')
            .attr('x1', function (d) {
                return xScale(d.lingua) + padding;
            })
            .attr('x2', function (d) {
                return xScale(d.lingua) + padding;
            })
            .attr('y1', 0)
            .attr('y2', graphHeight)
            .style('stroke', "#b6b6b6")
            .style('stroke-width', 2)
            .style('stroke-dasharray', 13);

        language = graph2.selectAll('g')
            .data(dados2)
            .enter()
            .append("g")
            .attr("class", function (d){
                return "age " + d.age;
            })

        language2 = language.selectAll("g")
            .data(function (d) {
                return d.LinguaGroup
            })
            .enter()
            .append('g')
            .attr("class", function (d){
                return "graph " + d.v.lingua2;
            })

        language2
            .append('line')
            .attr('x1', function (d) {
                return xScale(d.v.lingua2) + padding;
            })
            .attr('x2', function (d) {
                return xScale(d.v.lingua2) + padding;
            })
            .attr('y1', 0)
            .attr('y2', graphHeight)
            .style('stroke', "white")
            .style('stroke-width', 2.5)

        language2
            .append('line')
            .attr("class", function (d) {
                return "line " + d.v.lingua2;
            })
            .attr('x1', function (d) {
                return xScale(d.v.lingua2) + padding;
            })
            .attr('x2', function (d) {
                return xScale(d.v.lingua2) + padding;
            })
            .attr('y1', function (d) {
                return yScale(d.v.mediaPalavras2)+25;
            })
            .attr('y2', graphHeight)
            .style('stroke', "#b6b6b6")
            .style('stroke-width', 2)

        //CIRCULO EXTERIOR
        language2
            .append('circle')
            .attr("class", function (d) {
                return "circle " + d.v.lingua2;
            })
            .attr('cx', function (d) {
                return xScale(d.v.lingua2) + padding;
            })
            .attr('cy', function (d) {
                return yScale(d.v.mediaPalavras2);
            })
            .attr('r', 25)
            .attr('fill', function (d) {
                GeneroAge(d);
                if (girls > boys) {
                    return girl_color
                }
                else {
                    return boy_color
                }
            })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove2)
            .on("mouseleave", mouseleave)

        //CIRCULO INTERIOR
        language2
            .append('circle')
            .attr("class", function (d) {
                return "circle " + d.v.lingua2;
            })
            .attr('cx', function (d) {
                return xScale(d.v.lingua2) + padding;
            })
            .attr('cy', function (d) {
                return yScale(d.v.mediaPalavras2);
            })
            .attr('r', function (d) {
                GeneroAge(d);
                if (girls >= boys) {
                    return (percentage_boys * 25) / 100 // return raio rapazes
                }
                else {
                    return (percentage_girls * 25) / 100 // return raio rapazes
                }
            })
            .attr('fill', function (d) {
                GeneroAge(d);
                if (girls <= boys) {
                    return girl_color
                }
                else {
                    return boy_color
                }
            })
            .attr('stroke', 'white')
            .attr('stroke-width', '2px')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove3)
            .on("mouseleave", mouseleave)

        language2
            .on("mouseover", function() {
                d3.select(this)
                    .select(".graph .line")
                    .style("stroke", "#3b3b3b")
            })
            .on("mouseleave", function() {
                d3.select(this)
                    .select(".graph .line")
                    .style("stroke", "#b6b6b6")
            })

        group = language2.append('g')
            .attr("id", "group")
            .attr('transform', function (d) {
                return ('translate(' + (xScale(d.v.lingua2) + padding) + ',' + (yScale(d.v.mediaPalavras2)) + ')');
            });

        eduBars = group.selectAll('g')
            .data(dados2)
            .enter()

        eduBars2 = eduBars.selectAll("g")
            .data(function (d,i) {
                return d.education_age[i].v.valor
            })

        eduBars2
            .enter()
            .append('g')
            .attr("class", function (d){
                return "Edu " + d.z.edu + "==> " + d.z.valor;
            })

            .append('path')
            .attr("d", arc)
            .attr('fill', d=> colorScale(d.z.edu))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        geral = svg.append('g')
            .attr("id", "Overall_Average")
            .attr("transform", 'translate('+ (padding+38) + ',' + padding + ')')

        geral
            .selectAll("rect")
            .data(dados)
            .enter()
            .append("rect")
            .attr('x', function (d) {
                return xScale(d.lingua);
            })
            .attr('y', function (d) {
                return yScale(d.mediaPalavras);
            })
            .attr('width', 30)
            .attr('height', 2)
            .attr('fill', '#3b3b3b')

        const showChart = document.getElementById("dataviz");
        while (showChart.firstChild) {
            showChart.firstChild.remove();
        }
        showChart.appendChild(chartDIV);

    }

    //Eixos e Escalas
    function drawAxis(){
        // eixoY -> comprehension
        yScale = d3.scaleLinear()
            .domain([0, 700])
            .range([graphHeight, 0])

        yAxis = d3.axisLeft()
            .scale(yScale)
            .tickSize(-graphWidth);

        svg.append('g')
            .attr("class", "yAxis")
            .attr('transform', 'translate(' + (padding) + ',' + padding + ')')
            .call(yAxis);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -2)
            .attr("x", -(graphHeight / 2)-padding)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Average number of words learned")
            .attr("font-family", "Alexandria, sans serif")
            .attr("font-size", "12px")
            .attr("fill", "#b6b6b6")

        svg.selectAll('.yAxis')
            .selectAll('.domain')
            .attr("stroke", "none")
        svg.selectAll('.yAxis .tick line')
            .attr("stroke", "#ececec")
        svg.selectAll('.yAxis .tick text')
            .attr("x", -8)
            .attr("font-family", "Alexandria, sans serif")
            .attr("font-size", "10px")
            .attr("fill", "#3b3b3b")

        // eixoX -> language
        xScale = d3.scaleBand()
            .domain(dados.map(function (d) {
                return d.lingua
            }))
            .range([0, graphWidth]);

        xAxis = d3.axisBottom()
            .scale(xScale)
            .tickSize(-graphHeight);

        svg.append('g')
            .attr("class", "xAxis")
            .attr('transform', 'translate(' + padding + ',' + (padding + graphHeight) + ')')
            .call(xAxis);

        svg.append("text")      // text label for the x axis
            .attr("x", canvasWidth/2 )
            .attr("y", graphHeight + padding + 45 )
            .style("text-anchor", "middle")
            .text("Language")
            .attr("font-family", "Alexandria, sans serif")
            .attr("font-size", "12px")
            //.attr("font-weight", "bold")
            .attr("fill", "#b6b6b6")

        svg.selectAll('.xAxis .domain')
            .attr("stroke", "none")
        svg.selectAll('.xAxis .tick line')
            .attr("stroke", "none")
        svg.selectAll('.xAxis .tick text')
            .attr("y", 8)
            .attr("font-family", "Alexandria, sans serif")
            .attr("font-size", "10px")
            .attr("fill", "#3b3b3b")


        innerRadius = 28;
        outerRadius = 110;

        // X scale Path
        xx = d3.scaleBand()
            .range([- Math.PI/4, Math.PI/4])
            .domain(["Primary","Some Secondary","Secondary","Some College","College","Some Graduate","Graduate"]);

        // Y scale Path
        yy = d3.scaleRadial()
            .range([innerRadius, outerRadius])
            .domain([0,1]); //max value - 4585

        //Color Scale
        colorScale = d3.scaleOrdinal()
            .domain(["Primary","Some Secondary","Secondary","Some College","College","Some Graduate","Graduate"])
            .range(["#febd2a","#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c"]);
    }

    //Legenda
    function label(div_label,edu_label, id, txt, width, x, color, type) {
        div_label.append("div")
            .attr("id", id)

        edu_label = d3.select("#"+id).append("svg").attr("width", width).attr("height", 60).attr("align-self","center")
        edu_label.append("text")
            .attr("x", 0)
            .attr("y", 34)
            .text(txt)
            .style("font-size", "11px")

        if (type === "edu"){
            edu_label.append("path")
                .attr("d", "M3.44,19.71H17.67l3.07-19A116.83,116.83,0,0,0,.44.72")
                .attr("transform","translate("+x+" 20)")
                .attr("fill", color)
        }else if(type === "genre"){
            edu_label.append("circle")
                .attr('cx', x)
                .attr('cy', 30)
                .attr('r', 12)
                .attr("fill", color)
        }else if(type === "average"){
            edu_label.append("rect")
                .attr('x', x)
                .attr('y', 30)
                .attr('width', 30)
                .attr('height', 2)
        }else if(type === "missing"){
            edu_label.append("line")
                .attr('x1', x)
                .attr('x2', x)
                .attr('y1', 20)
                .attr('y2', 40)
                .style('stroke', "#b6b6b6")
                .style('stroke-width', 2)
                .style('stroke-dasharray', 4);
        }

    }

    //Títulos e Subtitulos
    function titles(){
        //title
        let title = d3.select("#title").append("svg").attr("width", 1400).attr("height", 65);
        title.append("text")
            .attr("text-anchor", "middle")
            //.attr("alignment-baseline", "baseline")
            .attr("x",canvasWidth/2)
            .attr("y","90%")
            .attr("margin-left",10)
            .text("Children's Vocabulary Development")
            .attr("font-family", "Alexandria, sans serif")
            .style("font-size", "32px")
            .style("font-weight", "bold")
            .attr("fill", "#3b3b3b")
        //Info Overlay
        let info = document.querySelector("#info__img")
        let info_content = document.querySelector(".info__content")
        info.addEventListener("mouseover", () => {
            info_content.style.display = "block"
        })
        info.addEventListener("mouseleave", () => {
            info_content.style.display = "none"
        })
        //subtitle
        let subtitle = d3.select("#subtitle").append("svg").attr("width", 1400).attr("height", 40);
        subtitle.append("text")
            .attr("text-anchor", "middle")
            .attr("x",canvasWidth/2)
            .attr("y", "60%")
            .text("Relation between the number of words learned by children from both genders and the caregiver education, by language")
            .attr("font-family", "Alexandria, sans serif")
            .style("font-size", "18px")
            // .style("font-weight", "bold")
            .attr("fill", "#3b3b3b")
    }

    function Genero(d) {
        Genre_value = Array.from(d3.group(d.genero, d => d[0], d => d[1])).sort(d3.ascending)
        girls = Array.from(Genre_value[0][1].keys()).reduce((ac, value) => {
            return ac + value
        }, 0)
        boys = Array.from(Genre_value[1][1].keys()).reduce((ac, value) => {
            return ac + value
        }, 0)

        total_kids = girls + boys
        percentage_girls = girls / total_kids * 100
        percentage_boys = boys / total_kids * 100
    }

    function GeneroAge(d) {
        Genre_value = Array.from(d3.group(d.v.genero, d => d[0], d => d[1])).sort(d3.ascending)
        if (Genre_value.length === 2){
            girls = Array.from(Genre_value[0][1].keys()).reduce((ac, value) => {
                return ac + value
            }, 0)
            boys = Array.from(Genre_value[1][1].keys()).reduce((ac, value) => {
                return ac + value
            }, 0)
        }else{
            let all_genre = Array.from(Genre_value[0][0]).reduce((ac, value) => {
                return ac + value
            }, )
            if(all_genre === "Male"){
                boys = 1;
                girls = 0;
            }else{
                boys = 0;
                girls = 1;
            }
        }

        total_kids = girls + boys
        percentage_girls = girls / total_kids * 100
        percentage_boys = boys / total_kids * 100
    }
});