let apiUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"

GDPGraph ()


function GDPGraph () {
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // document.getElementById('GDP').innerHTML = JSON.stringify(data.data);

        var height = document.documentElement.clientHeight * .8,
            margin = 60,
            width = document.documentElement.clientWidth - margin * 2;
    
        var GDPbyQuarter = [],
            yearQuarter =[]
            labels =[[],[],[]]
            years=[]

        const svg = d3.select(document.getElementById('GDP'))
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        for(i = 0; i < data.data.length; i++){
            GDPbyQuarter.push(data.data[i][1])
        }

        for(i = 0; i < data.data.length; i++){
            yearQuarter.push(data.data[i][0])
        }

        // console.log(yearQuarter)

        for ( j = 0; j <yearQuarter.length; j++){
            var thisBar = yearQuarter[j].split('-')
            // console.log('this bar: ',thisBar);
            switch(thisBar[1]){
                case '01':
                    // console.log('case 1')
                    // console.log(thisBar[1]);
                    var quarter = ('Quarter 1');
                    break;
                case '04':
                    var quarter = ('Quarter 2');
                    break;
                case '07':
                    var quarter = ('Quarter 3');
                    break;
                case '10':
                    var quarter = ('Quarter 4');
                    break;
            }
            var year = thisBar[0]

            years.push(year);

            var dollars = (GDPbyQuarter[j])
            
            if (dollars < 1000)
           {labels.push(
                year + '-'  + quarter+ ': '+ dollars.toFixed(2) + ' billion dollars'
            )}
            else {
                labels.push(
                    year + '-'  + quarter+ ': '+ (dollars/1000).toFixed(2) + ' trillion dollars'
                )
            }

        }


        const maxNumber = d3.max(GDPbyQuarter)
    
        // console.log(maxNumber);
    
        const xScale = d3.scaleLinear()
        .domain([0, GDPbyQuarter.length])
        .range([margin , width - margin]);
    
        const yScale = d3.scaleLinear()
        .domain([0, maxNumber])
        .range([0, height - margin]);

        const yScaleReversed = d3.scaleLinear()
        .domain([0, maxNumber])
        .range([ height - margin, margin]);

        var minDate = d3.min(years),
            maxDate = d3.max(years);

        console.log('minDate: ', minDate, 'maxDate: ', maxDate)

        var parse= d3.timeParse('%Y');

        const yearScale = d3.scaleTime()
        .domain([parse(minDate), parse(maxDate)])
        .range([margin, width - margin])
        
    
    
    
        
        svg.selectAll('rect')
            .data(GDPbyQuarter)
            .enter() 
            .append('rect')
            .attr("x", (d, i) => xScale(i) )
            .attr("y", (d, i) => height - yScale(d) - margin)
            .attr('class', 'bar')
            .style('height', (d) => yScale(d)+'px')
            .style('width', ((1/(GDPbyQuarter.length+margin)*width)+'px'))
            .append('title')
            .attr('class', 'title')
            .text((d, i) => labels[i])
            
       
        
        const xAxis = d3.axisBottom(yearScale);
        const yAxis = d3.axisLeft(yScaleReversed);

        svg.append("g")
        .call(xAxis)
        .attr("transform", "translate(0," + (height - margin ) + ")")
        .attr("position", "absolute");
        


        svg.append('g')
            .attr('transform', 'translate('+margin+',0)')
            .attr('position', 'absolute')
            .call(yAxis);
    })
}