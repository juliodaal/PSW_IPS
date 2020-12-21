// obter os dados de forma assíncrona
const getData = (id) => {
    d3.json("http://localhost:8081/sensor/" + id + "/sample", useData);
}
// função de callback que utiliza os dados lidos
const useData = (err, data) => {
    // tratamento de erro na leitura do ficheiro
    if (err) {
        throw err;
    }

    // obter o atributo com os dados
    data = data.data;

    // validação dos dados recebidos
    data.forEach(function(d) {
        d.timestamp = new Date(d.timestamp).toDateString();
        d.value = +d.value;
    });

    // gerar gráfico de barras
    drawBarChart(data);
    // gerar gráfico de linhas
    drawLineChart(data);
    // gerar gráfico de queijo
    drawPieChart(data);
};
// gerar um gráfico de barras
const drawBarChart = (data) => {
    // preparação
    var containerWidth = 500, containerHeight = 400;    // dimensões do contentor
    var svg = d3.select('#svg1')                        // selecionar elemento svg com id 'svg1'
        .attr("width", containerWidth)                  // definir atributo width do elemento
        .attr("height", containerHeight);               // definir atributo height do elemento
    var margin = 150;                                   // definir margem interior do contentor
    var width = containerWidth - margin;                // dimensões interiores do contentor
    var height = containerHeight - margin;
    var totalRows = data.length;                        // número de linhas de dados
    var offset = { x: 100, y: 50 };                     // deslocação do ponto central do gráfico 
    var barWidth = (width - offset.x) / totalRows - 2;  // dimensão de cada barra em função do espaço disponível

    // escalas
    // as escalas servem para enquadrar os valores dos dados na área do gráfico
    // é estabelecida um relacionamento entre os valores do domínio (domain) e 
    // os valores da área de desenho (range))
    var x = d3.scaleBand()                                  // definir uma escala de valores nominais
        .range([0, (width - offset.x)])                     // definir a gama de valores da escala no contexto da página
        .domain(data.map(function (d) { return d.timestamp; })); // definir o domínio de valores no contexto dos dados
    var y = d3.scaleLinear()                                // definir uma escala linear
        .range([height, 0])                                 // definir a gama de valores de forma invertida
        .domain([0, d3.max(data, function(d) { 
            return parseInt(d.value); 
        })]); // definir o domínio 

    // eixos
    // os eixos são a representação gráfica de uma escala
    var xAxis = d3.axisBottom(x);   // definir um eixo na zona inferior do gráfico com escala x
    var yAxis = d3.axisLeft(y);     // definir um eixo na zona lateral esquerda do gráfico com a escal y
    // adicionar eixo X
    svg.append("g")                                         // adicionar um elemento gráfico ao svg
        .attr("class", "x axis")                            // definir o atributo class do elemento
        .attr("transform", "translate(" + offset.x + "," + (offset.y + height) + ")")   // posicionar o eixo na zona inferior do gráfico
        .call(xAxis)                                        // gerar visualização do eixo
        .selectAll("text")                                  // selecionar todos os textos do eixo
        .style("text-anchor", "end")                        // definir o ponto de referência do elemento texto
        .attr("dx", "-.8em")                                // definir deslocação em x
        .attr("dy", "-.55em")                               // definir deslocação em y
        .attr("transform", "rotate(-90)");                  // rodar o texto -90 graus para ficar vertical
    // adicionar eixo Y
    svg.append("g")                                         // adicionar um elemento gráfico ao svg
        .attr("class", "y axis")                            // definir o atributo class do elemento
        .attr("transform", "translate(" + offset.x + "," + offset.y + ")")   // posicionar o eixo na zona lateral do gráfico
        .call(yAxis)                                        // gerar visualização do eixo
        .append("text")                                     // adicionar o texto da legenda
        .attr("y", 6)                                       // definir posicionamento em y
        .attr("dy", ".71em")                                // definir deslocação em y
        .style("text-anchor", "end")                        // definir o ponto de referência do elemento texto
        .text("value ($)");                                 // definir o conteúdo do texto

    // barras
    svg.selectAll("g.bar")                                  // selecionar todas as barras
        .data(data)                                         // utilizar os dados definidos em data
        .enter()                                            // gerar elementos ainda não desenhados
        .append("rect")                                     // adicionar rectângulo
        .attr("class", "bar")                               // definir atributo class do elemento
        .attr('fill', 'silver')                             // definir a cor de preenchimento do elemento
        .on('mouseenter', function(d) {                     // definir função de callback do evento mouseenter
            d3.select(this).attr('fill', 'orange');         // definir o preenchimento com a cor laranja
        })
        .on('mouseleave', function(d) {                     // definir função de callback do evento mouseleave
            d3.select(this).attr('fill', 'silver');         // definir o preenchimento com a cor prateada
        })
        .attr("x", function (d) { return offset.x + x(d.timestamp); })   // definir posição x baseada na posição devolvida pela escala x
        .attr("width", barWidth)                                    // definir largura da barra
        .attr("y", function (d) { return offset.y + y(d.value); })  // definir posição do topo da barra devolvida pela escala y
        .attr("height", function (d) { return height - y(d.value); });  // definir altura da barra

    
    // legendas
    // texto de suporte ao gráfico posicionado junto de cada barra
    // utiliza-se uma transição para animar o posicionamento do texto
    svg.selectAll("g.text")                                 // selecionar elemento 
        .data(data)                                         // utilizar os dados definidos em data
        .enter()                                            // gerar elementos ainda não desenhados
        .append("text")                                     // adicionar elemento de texto
        .transition()                                       // definir uma transição
        .delay(function (d, i) {                            // definir uma função de atraso para o início da animação
            return i * 100;                                 // cada elemento atrasa 100ms 
        })
        .duration(1000)                                     // duração da transição de 1000ms
        .attr("x", function (d) { return offset.x + barWidth / 2 + x(d.timestamp); })    // posicionar texto no centro de cada barra
        .attr("y", function (d) { return offset.y + y(d.value) - 10; })             // posicionar texto no topo de cada barra
        .attr('text-anchor', 'middle')                      // definir ponto de referência do elemento texto
        .attr('class', 'barLabel')                          // definir classe CSS do elemento
        .text(function (d) { return (d.value).toLocaleString(); }); // definir conteúdo do texto
};
// gerar um gráfico de linhas
const drawLineChart = (data) => {
    var containerWidth = 500, containerHeight = 400;
    var svg = d3.select('#svg2')
        .attr("width", containerWidth)
        .attr("height", containerHeight);
    var margin = 150;
    var width = containerWidth - margin;
    var height = containerHeight - margin;
    var totalRows = data.length;
    var offset = { x: 100, y: 50 };
    var barWidth = (width - offset.x) / totalRows - 2;

    // escalas
    var x = d3.scaleBand()
        .range([0, (width - offset.x)])
        .domain(data.map(function (d) { return d.timestamp; }));

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return parseInt(d.value); })]);

    // eixos
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    // gerador de linhas
    // importante: é necessário um estilo CSS associado para visualizar
    // correctamente as linhas (neste caso .line)
    var line = d3.line()                                            // definir linhas
    .x(function(d) { return offset.x + barWidth/2 + x(d.timestamp); })   // definir posição inicial
    .y(function(d) { return offset.y + y(d.value); });              // definir posição final

    svg.append('path')                  // adicionar um caminho
        .data([data])                   // utilizando os dados em data
        .attr('class', 'line')          // definir classe de elemento como .line
        .attr('d', line);               // definir conteúdo do caminho devolvido pelo gerador de linhas

    // append x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + offset.x + "," + (offset.y + height) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");
    // append y axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + offset.x + "," + offset.y + ")")
        .call(yAxis)
        .append("text")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("value ($)");
    // labels
    svg.selectAll("g.text")
        .data(data)
        .enter()
        .append("text")
        .transition()
        .delay(function(d, i) {
            return i * 100;
        }) 
        .duration(1000)
        .attr("x", function (d) { return offset.x + barWidth/2 + x(d.ano); })
        .attr("y", function(d) { return offset.y + y(d.total) - 10; })
        .attr('text-anchor', 'middle')
        .attr('class', 'barLabel')
        .text(function(d) { return (d.total/1000).toLocaleString(); });
};
// gerar um gráfico de queijo
// neste gráfico não existe necessidade de eixos
// mas queremos uma escala de cores para os elementos
const drawPieChart = (data) => {
    var containerWidth = 500, containerHeight = 400;
    var svg = d3.select('#svg3')
        .attr("width", containerWidth)
        .attr("height", containerHeight);
    var margin = 150;
    var width = containerWidth - margin;
    var height = containerHeight - margin;
    var innerRadius= 0;
    var outerRadius= height / 2;
    
    // definir uma gama de cores
    const colors = ["cyan", "orange", "brown", "green", "yellow", "blue", "red", "black", "pink", "white", "gray", "purple"];
    
    // gerador de arcos
    var arc = d3.arc()                  // definir arco
        .innerRadius(innerRadius)       // definir o raio interior
        .outerRadius(outerRadius);      // definir o raio exterior
    // gerador de queijo
    var pie = d3.pie().value(function (d) {     // definir um queijo
        return d.value;                         // valores baseados na pontuação
    });
    // gerar arcos
    var arcs = svg.selectAll('g.arc')           // selecionar arcos
        .data(pie(data))                        // utilizar os dados devolvidos pelo gerador de queijo
        .enter()                                // desenhar elementos ainda não presentes
        .append('g')                            // adicionar elemento gráfico
        .attr('class', 'arc')                   // atribuir classe .arc
        .attr('transform', 'translate(' + (width / 2) + ', ' + (outerRadius + 50) + ')');   // posicionar arco
    // adicionar caminhos ao arcos
    arcs.append('path')                         // adicionar caminho
        .attr('fill', function (d, i) {         // preencher com cor da gama de cores
            return colors[i];
        })
        .style("opacity", 0.5)                  // definir opacidade do elemento
        .attr('d', arc);                        // atribuir o arco
    // adicionar legendas
    arcs.append('text')                         // adicionar texto aos arcos
        .attr('transform', function (d) {       // posicionar 
            return 'translate(' + arc.centroid(d) + ')';    // no centro do arco
        })
        .attr('text-anchor', 'middle')          // definir ponto de referência do texto
        .attr('font-size', (height * 0.05) + 'px')  // definir tamanho relativo do texto 
        .text(function (d) {                    // definir o conteúdo da legenda
            return (d.data.value);              // pontuação
        });
};
// início
function start(id) {
    getData(id);
}