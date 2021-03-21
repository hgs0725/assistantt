
var num = Math.random();
var data = {
    labels: '<%=chartlabels%>',
    datasets: [{
        data: '<%=chartdatas%>',
        backgroundColor: ["#f79546", "#9bba57", "#4f81bb", "#5f497a", "#a94069", "#ff5f34", "#41774e", "#003663", "#49acc5", "#c0504e"],
        borderWidth: 0,
        label: "Dataset 1"
    }]
};
window.onload = function() {
        var ctx8 = $('#chart8').get(0).getContext("2d");
        window.theChart8 = new Chart(ctx8, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                legend: false,
                maintainAspectRatio: false,
                animation: false,
                pieceLabel: {
                    mode: "label",
                    position: "outside",
                    fontSize: 11,
                    fontStyle: 'bold'
                }
            }
        
    
        });
    }