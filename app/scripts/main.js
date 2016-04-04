var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({

    el: $('#paper'),
    width: '100%',
    height: 800,
    gridSize: 1,
    model: graph
});

function buildGraphFromAdjacencyList(adjacencyList) {
	var elements = [];
	var links = [];

	_.each(adjacencyList, function(edges, parentElementLabel) {
		elements.push(makeElement(parentElementLabel));

		_.each(edges, function(childElementLabel) {
			links.push(makeLink(parentElementLabel, childElementLabel));
		});
	});

    return elements.concat(links);
}

function makeLink(parentElementLabel, childElementLabel) {
	return new joint.dia.Link({
		source: { id: parentElementLabel },
		target: { id: childElementLabel },
		attrs: { '.marker-target': { d: 'M 4 0 L 0 2 L 4 4 z'} },
		smooth: true
	});
}

function makeElement(label) {
	var maxLineLength = _.max(label.split('\n'), function(l) { return l.length; }).length;

	var letterSize = 8;
	var width = 2 * ( letterSize * (0.6 * maxLineLength + 1));
	var height = 2 * ((label.split('\n').length + 1) * letterSize);

	return new joint.shapes.basic.Rect({
		id: label,
		size: { width: width, height: height },
		attrs: {
			text: { text: label, 'font-size': letterSize, 'font-family': 'monospace' },
			rect: {
				width: width, height: height,
				rx: 5, ry: 5,
				stroke: '#555'
			}
		}
	});
}

V(paper.viewport).translate(20, 20);

$('#layout').on('click', layout);
$('#render').on('click', renderCanvas);

function layout() {
    
    try {
        var adjacencyList = eval('adjacencyList = ' + $('#adjacency-list').val());
    } catch (e) { alert(e); }
    
    var cells = buildGraphFromAdjacencyList(adjacencyList);
    graph.resetCells(cells);
    joint.layout.DirectedGraph.layout(graph, { setLinkVertices: false });
    paper.$el.css('pointer-events', 'none')
}

function renderCanvas() {
	var svg = document.querySelector('svg');
	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(svg);
	var canvas = document.getElementById('canvas');
	canvg(canvas, svgString);

	var renderImage = canvas.toDataURL('image/png');
	$('#renderImage').attr('src', renderImage);
}
