function extractText() {
  const fileInput = document.getElementById('pdfFile');
  const output = document.getElementById('output');
  output.textContent = "Loading...";

  if (!fileInput.files.length) {
    output.textContent = "Please select a PDF file.";
    return;
  }

  const file = fileInput.files[0];
  const fileReader = new FileReader();

  fileReader.onload = function () {
    const typedarray = new Uint8Array(this.result);

    pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
      let totalText = '';
      const numPages = pdf.numPages;
      const readPages = [];

      for (let i = 1; i <= numPages; i++) {
        readPages.push(
          pdf.getPage(i).then(function (page) {
            return page.getTextContent().then(function (textContent) {
              const pageText = textContent.items.map(item => item.str).join(' ');
              totalText += pageText + '\n\n';
            });
          })
        );
      }

      Promise.all(readPages).then(() => {
        output.textContent = totalText.trim();

        // 🔍 Extract lines containing dates
        const eventLines = totalText.split("\n").filter(line =>
          /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}/i.test(line)
        );

        console.log("Detected Event Lines:", eventLines);
        const eventList = document.getElementById('eventList');
        eventList.innerHTML = '';

        const eventObjects = eventLines.map(line => {
          const dateMatch = line.match(/\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})\b/);
          let formattedDate = null;

          if (dateMatch && dateMatch.length === 4) {
            const [_, day, month, year] = dateMatch;

            const paddedDay = day.padStart(2, '0');
            const paddedMonth = month.padStart(2, '0');
            const fullYear = year.length === 2 ? "20" + year : year;

            formattedDate = `${fullYear}-${paddedMonth}-${paddedDay}`;
          }

          return formattedDate
            ? {
                title: line.replace(/\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}/i, '').trim(),
                date: formattedDate
              }
            : null;
        }).filter(e => e !== null);

        console.log("Event Objects:", eventObjects);

        eventObjects.forEach(event => {
          const li = document.createElement("li");
          li.textContent = `${event.date} - ${event.title}`;
          eventList.appendChild(li);
        });
      });
    });
  };

  fileReader.readAsArrayBuffer(file);
}
